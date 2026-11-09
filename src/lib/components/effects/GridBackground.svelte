<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
		/** Ruled lines, or a dot on every point where two lines would cross. */
		variant?: 'lines' | 'dots';
		/** Distance between two lines, in pixels. */
		size?: number;
		/** Line width, or dot diameter, in pixels. */
		thickness?: number;
		/** Draw every n-th line stronger, like graph paper. Lines only. */
		major?: number;
		/** Any CSS color. Defaults to the border token, a step stronger for dots. */
		color?: string;
		/** Where the pattern fades out. */
		fade?: 'none' | 'radial' | 'edges' | 'top' | 'bottom';
		/**
		 * `pan` drifts the pattern, `spotlight` lights it up around the pointer,
		 * `lift` raises the dots near the pointer off the page, in the lit color.
		 * `lift` is for dots; on lines it acts like `spotlight`.
		 */
		animation?: 'none' | 'pan' | 'spotlight' | 'lift';
		/** Which way `pan` moves. */
		direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
		/** Pixels per second for `pan`. */
		speed?: number;
		/** Radius of the `spotlight` or `lift`, in pixels. */
		radius?: number;
		/** Color of the lit pattern. Defaults to the accent. */
		spotlightColor?: string;
		/** How high the dots rise with `lift`. 3 lifts the one under the pointer about half a cell. */
		lift?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'lines',
		size = 32,
		thickness,
		major,
		color,
		fade = 'none',
		animation = 'none',
		direction = 'diagonal',
		speed = 12,
		radius = 160,
		spotlightColor = 'var(--color-accent)',
		lift = 3,
		class: className,
		children,
		...rest
	}: Props = $props();

	let element = $state<HTMLDivElement | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);
	let lit = $state(false);
	// The canvas takes over the dots once it has drawn them; until then, and
	// without JavaScript, the gradient shows them.
	let drawn = $state(false);

	let stroke = $derived(thickness ?? (variant === 'dots' ? 2 : 1));
	let ink = $derived(
		color ?? (variant === 'dots' ? 'var(--color-border-strong)' : 'var(--color-border)')
	);
	let majorEvery = $derived(variant === 'lines' && major && major > 1 ? Math.round(major) : 0);

	// One full repeat of the pattern. Moving by exactly this much loops without a seam.
	let period = $derived(size * (majorEvery || 1));
	let panning = $derived(animation === 'pan' && !prefersReducedMotion.current);
	// Lifting moves single dots, which a gradient cannot do, so the dots are drawn
	// on a canvas instead. Lines, and reduced motion, get the spotlight.
	let lifting = $derived(
		animation === 'lift' && variant === 'dots' && !prefersReducedMotion.current
	);
	let spotlight = $derived(animation === 'spotlight' || (animation === 'lift' && !lifting));
	let tracking = $derived(spotlight || lifting);

	/** The pattern in a given color, as background layers centered on the element. */
	function pattern(ink: string, weight: number) {
		if (variant === 'dots') {
			const r = weight / 2;
			return {
				image: `radial-gradient(circle, ${ink} ${r}px, transparent ${r + 0.5}px)`,
				size: `${size}px ${size}px`,
				position: '50% 50%'
			};
		}

		// The line sits at the start of each tile; shift it so one runs through the center.
		const line = (every: number, w: number, c: string) => {
			const tile = size * every;
			const offset = `calc(50% + ${tile / 2 - w / 2}px)`;
			return {
				image: [
					`linear-gradient(to right, ${c} ${w}px, transparent ${w}px)`,
					`linear-gradient(to bottom, ${c} ${w}px, transparent ${w}px)`
				],
				size: `${tile}px ${tile}px`,
				position: `${offset} ${offset}`
			};
		};

		const layers = [line(1, weight, ink)];
		if (majorEvery) {
			layers.unshift(line(majorEvery, weight, `color-mix(in oklab, ${ink}, var(--color-fg) 22%)`));
		}

		return {
			image: layers.flatMap((layer) => layer.image).join(', '),
			size: layers.flatMap((layer) => [layer.size, layer.size]).join(', '),
			position: layers.flatMap((layer) => [layer.position, layer.position]).join(', ')
		};
	}

	let base = $derived(pattern(ink, stroke));
	let highlight = $derived(
		pattern(spotlightColor, variant === 'dots' ? stroke * 1.75 : stroke * 1.5)
	);

	const shifts = {
		up: [0, -1],
		down: [0, 1],
		left: [-1, 0],
		right: [1, 0],
		diagonal: [1, 1]
	} as const;
	let shift = $derived(shifts[direction]);

	/**
	 * Draws every dot on a canvas, and lets the ones near the pointer rise off
	 * the page on a spring: up, bigger and in the lit color. Only runs frames
	 * while something is still moving.
	 */
	function createLifter(target: HTMLCanvasElement) {
		const context = target.getContext('2d');
		// Height and speed of every dot that is off the page, keyed by grid cell.
		const dots = new Map<string, { level: number; speed: number }>();
		let px: number | null = null;
		let py: number | null = null;
		let frame = 0;
		let width = 0;
		let height = 0;
		let ratio = 1;

		// Colors from the plain dot to the lit one. The canvas reads them the way
		// CSS would, so tokens and color-mix() work; once per visit is enough.
		const steps = 12;
		let palette: string[] = [];
		const mix = () => {
			palette = Array.from({ length: steps + 1 }, (_, n) => {
				target.style.color = `color-mix(in oklab, ${spotlightColor} ${(n / steps) * 100}%, ${ink})`;
				return getComputedStyle(target).color;
			});
		};

		const resize = () => {
			ratio = window.devicePixelRatio || 1;
			width = target.clientWidth;
			height = target.clientHeight;
			target.width = Math.round(width * ratio);
			target.height = Math.round(height * ratio);
		};

		const dot = (x: number, y: number, r: number) => {
			context!.beginPath();
			context!.arc(x, y, r, 0, Math.PI * 2);
			context!.fill();
		};

		function step() {
			frame = 0;
			if (!context) return;
			// Dots sit at the center of the element plus whole steps of `size`.
			const ox = width / 2;
			const oy = height / 2;
			const r = stroke / 2;
			const rise = size * 0.55 * (lift / 3);

			if (px !== null && py !== null) {
				for (let i = Math.ceil((px - radius - ox) / size); i * size + ox <= px + radius; i++) {
					for (let j = Math.ceil((py - radius - oy) / size); j * size + oy <= py + radius; j++) {
						const key = `${i},${j}`;
						if (!dots.has(key)) dots.set(key, { level: 0, speed: 0 });
					}
				}
			}

			// A spring per dot: a little overshoot reads as lifting, not fading.
			let moving = false;
			for (const [key, state] of dots) {
				const [i, j] = key.split(',').map(Number);
				let goal = 0;
				if (px !== null && py !== null) {
					const t = Math.max(0, 1 - Math.hypot(ox + i * size - px, oy + j * size - py) / radius);
					goal = t * t * (3 - 2 * t);
				}
				state.speed = (state.speed + (goal - state.level) * 0.14) * 0.74;
				state.level += state.speed;
				if (Math.abs(goal - state.level) > 0.001 || Math.abs(state.speed) > 0.001) moving = true;
				else if (goal === 0) dots.delete(key);
			}

			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			context.clearRect(0, 0, width, height);

			// The resting grid, minus the dots that are in the air.
			context.fillStyle = palette[0];
			for (let x = ox - Math.floor(ox / size) * size; x <= width; x += size) {
				for (let y = oy - Math.floor(oy / size) * size; y <= height; y += size) {
					const key = `${Math.round((x - ox) / size)},${Math.round((y - oy) / size)}`;
					if (!dots.has(key)) dot(x, y, r);
				}
			}

			// Lowest first, so a dot higher up the hill is drawn over its neighbors.
			const lifted = [...dots].sort((a, b) => a[1].level - b[1].level);
			for (const [key, { level }] of lifted) {
				const [i, j] = key.split(',').map(Number);
				const x = ox + i * size;
				const y = oy + j * size;
				const amount = Math.max(0, Math.min(1, level));
				context.fillStyle = palette[Math.round(amount * steps)];
				dot(x, y - rise * level, r * (1 + 0.9 * Math.max(0, level)));
			}

			if (moving) schedule();
		}

		function schedule() {
			if (!frame) frame = requestAnimationFrame(step);
		}

		const observer = new ResizeObserver(() => {
			resize();
			schedule();
		});
		observer.observe(target);
		resize();
		mix();

		// A theme switch changes the colors without moving anything; redraw for it.
		const themes = new MutationObserver(() => {
			mix();
			schedule();
		});
		themes.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'style']
		});
		// A subtree can carry its own theme too.
		themes.observe(document.body, {
			attributes: true,
			subtree: true,
			attributeFilter: ['data-ck-theme']
		});

		return {
			point(x: number | null, y: number | null) {
				// Picks up a theme switch between two visits.
				if (x !== null && px === null) mix();
				px = x;
				py = y;
				schedule();
			},
			stop() {
				cancelAnimationFrame(frame);
				observer.disconnect();
				themes.disconnect();
			}
		};
	}

	// The pointer is tracked on the window, so the spotlight still follows it when
	// the grid sits behind other content that takes the pointer events.
	$effect(() => {
		if (!tracking || !element) return;
		const node = element;
		const lifter = lifting && canvas ? createLifter(canvas) : null;
		drawn = Boolean(lifter);
		let frame = 0;
		let x = -1;
		let y = -1;

		const update = () => {
			frame = 0;
			const box = node.getBoundingClientRect();
			const inside = x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
			// Inside a scaled parent the box on screen and the layout size differ.
			const sx = box.width / (node.offsetWidth || box.width || 1);
			const sy = box.height / (node.offsetHeight || box.height || 1);
			const lx = (x - box.left) / sx;
			const ly = (y - box.top) / sy;
			lit = inside;
			if (inside) {
				node.style.setProperty('--ck-grid-x', `${lx}px`);
				node.style.setProperty('--ck-grid-y', `${ly}px`);
			}
			lifter?.point(inside ? lx : null, inside ? ly : null);
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};
		const move = (event: PointerEvent) => {
			x = event.clientX;
			y = event.clientY;
			schedule();
		};
		const leave = (event: PointerEvent) => {
			if (event.relatedTarget) return;
			x = y = -1;
			schedule();
		};

		window.addEventListener('pointermove', move, { passive: true });
		window.addEventListener('scroll', schedule, { passive: true, capture: true });
		document.addEventListener('pointerout', leave);
		return () => {
			cancelAnimationFrame(frame);
			lifter?.stop();
			drawn = false;
			window.removeEventListener('pointermove', move);
			window.removeEventListener('scroll', schedule, { capture: true });
			document.removeEventListener('pointerout', leave);
			lit = false;
		};
	});
</script>

<div bind:this={element} class={cn('relative isolate', className)} {...rest}>
	<div
		aria-hidden="true"
		class="ck-grid pointer-events-none absolute inset-0 -z-10 overflow-hidden"
		data-fade={fade}
	>
		<div
			class="ck-grid-layer"
			class:ck-grid-pan={panning}
			class:ck-grid-hidden={drawn}
			style:inset={panning ? `-${period}px` : '0'}
			style:background-image={base.image}
			style:background-size={base.size}
			style:background-position={base.position}
			style:--ck-grid-dx="{shift[0] * period}px"
			style:--ck-grid-dy="{shift[1] * period}px"
			style:--ck-grid-duration="{period / Math.max(speed, 0.1)}s"
		></div>

		{#if lifting}
			<canvas bind:this={canvas} class="ck-grid-layer ck-grid-lift"></canvas>
		{/if}

		{#if spotlight}
			<div
				class="ck-grid-layer ck-grid-spotlight"
				class:ck-grid-lit={lit}
				style:background-image={highlight.image}
				style:background-size={highlight.size}
				style:background-position={highlight.position}
				style:--ck-grid-radius="{radius}px"
			></div>
		{/if}
	</div>

	{@render children?.()}
</div>

<style>
	.ck-grid-layer {
		position: absolute;
		background-repeat: repeat;
	}

	/* translate3d keeps the drift on the compositor, which moves it in fractions
	   of a pixel. Slow pans otherwise step one whole pixel at a time. */
	.ck-grid-pan {
		animation: ck-grid-pan var(--ck-grid-duration) linear infinite;
		will-change: transform;
		backface-visibility: hidden;
	}

	@keyframes ck-grid-pan {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(var(--ck-grid-dx), var(--ck-grid-dy), 0);
		}
	}

	.ck-grid-spotlight {
		inset: 0;
		opacity: 0;
		transition: opacity 250ms ease-out;
		mask-image: radial-gradient(
			circle var(--ck-grid-radius) at var(--ck-grid-x, 50%) var(--ck-grid-y, 50%),
			black,
			transparent
		);
	}

	.ck-grid-hidden {
		visibility: hidden;
	}

	.ck-grid-lift {
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.ck-grid-lit {
		opacity: 1;
	}

	.ck-grid[data-fade='radial'] {
		mask-image: radial-gradient(ellipse at center, black 25%, transparent 72%);
	}

	.ck-grid[data-fade='edges'] {
		mask-image:
			linear-gradient(to right, transparent, black 15%, black 85%, transparent),
			linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
		mask-composite: intersect;
	}

	.ck-grid[data-fade='top'] {
		mask-image: linear-gradient(to bottom, transparent, black 70%);
	}

	.ck-grid[data-fade='bottom'] {
		mask-image: linear-gradient(to top, transparent, black 70%);
	}
</style>
