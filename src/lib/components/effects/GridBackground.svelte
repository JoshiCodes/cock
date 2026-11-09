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
		/** `pan` drifts the pattern, `spotlight` lights it up around the pointer. */
		animation?: 'none' | 'pan' | 'spotlight';
		/** Which way `pan` moves. */
		direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
		/** Pixels per second for `pan`. */
		speed?: number;
		/** Radius of the `spotlight`, in pixels. */
		radius?: number;
		/** Color of the lit pattern. Defaults to the accent. */
		spotlightColor?: string;
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
		class: className,
		children,
		...rest
	}: Props = $props();

	let element = $state<HTMLDivElement | null>(null);
	let lit = $state(false);

	let stroke = $derived(thickness ?? (variant === 'dots' ? 2 : 1));
	let ink = $derived(
		color ?? (variant === 'dots' ? 'var(--color-border-strong)' : 'var(--color-border)')
	);
	let majorEvery = $derived(variant === 'lines' && major && major > 1 ? Math.round(major) : 0);

	// One full repeat of the pattern. Moving by exactly this much loops without a seam.
	let period = $derived(size * (majorEvery || 1));
	let panning = $derived(animation === 'pan' && !prefersReducedMotion.current);
	let spotlight = $derived(animation === 'spotlight');

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

	// The pointer is tracked on the window, so the spotlight still follows it when
	// the grid sits behind other content that takes the pointer events.
	$effect(() => {
		if (!spotlight || !element) return;
		const node = element;
		let frame = 0;
		let x = -1;
		let y = -1;

		const update = () => {
			frame = 0;
			const box = node.getBoundingClientRect();
			const inside = x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
			lit = inside;
			if (inside) {
				node.style.setProperty('--ck-grid-x', `${x - box.left}px`);
				node.style.setProperty('--ck-grid-y', `${y - box.top}px`);
			}
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
			style:inset={panning ? `-${period}px` : '0'}
			style:background-image={base.image}
			style:background-size={base.size}
			style:background-position={base.position}
			style:--ck-grid-dx="{shift[0] * period}px"
			style:--ck-grid-dy="{shift[1] * period}px"
			style:--ck-grid-duration="{period / Math.max(speed, 0.1)}s"
		></div>

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

	.ck-grid-pan {
		animation: ck-grid-pan var(--ck-grid-duration) linear infinite;
		will-change: transform;
	}

	@keyframes ck-grid-pan {
		to {
			transform: translate(var(--ck-grid-dx), var(--ck-grid-dy));
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
