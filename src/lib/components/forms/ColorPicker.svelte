<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRing, focusRingInset, transition } from '../../utils/styles.js';
	import { formatOklch, maxChroma, oklchToRgb, parseColor } from '../../utils/oklch.js';

	interface Props {
		/** An `oklch(…)` string. Hex is accepted too and converted on the first change. */
		value?: string;
		/** Colors offered as one-click choices, in any format `value` accepts. */
		swatches?: string[];
		/** Names the picker for screen readers. */
		label?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable('oklch(0.62 0.17 316)'),
		swatches = [],
		label = 'Color',
		class: className,
		onchange
	}: Props = $props();

	/**
	 * Lightness, saturation and hue. Saturation is chroma as a share of the most
	 * this lightness and hue can have on screen, so every point of the area is a
	 * color the screen can actually show.
	 */
	let lightness = $state(0.62);
	let saturation = $state(0.5);
	let hue = $state(316);

	let draft = $state('');

	function adopt(text: string) {
		const parsed = parseColor(text);
		if (!parsed) return false;
		const [l, c, h] = parsed;
		const most = maxChroma(l, h);
		lightness = l;
		hue = h;
		saturation = most > 0 ? Math.min(1, c / most) : 0;
		return true;
	}

	// Read the starting value right away, so the server renders the right thumb.
	adopt(value);
	let emitted = value;
	draft = value;

	// Follow changes from outside without echoing our own back.
	$effect(() => {
		if (value === emitted) return;
		adopt(value);
		emitted = value;
		draft = value;
	});

	let current = $derived(formatOklch([lightness, saturation * maxChroma(lightness, hue), hue]));

	function emit() {
		emitted = value = current;
		draft = value;
		onchange?.(value);
	}

	function set(l: number, s: number, h = hue) {
		lightness = Math.min(1, Math.max(0, l));
		saturation = Math.min(1, Math.max(0, s));
		hue = ((h % 360) + 360) % 360;
		emit();
	}

	/* -- the area ------------------------------------------------------------ */

	let canvas = $state<HTMLCanvasElement>();
	let area = $state<HTMLDivElement>();

	// Repainted when the hue moves. Small on purpose; CSS scales it up smoothly.
	$effect(() => {
		const context = canvas?.getContext('2d');
		if (!context || !canvas) return;
		const { width, height } = canvas;
		const image = context.createImageData(width, height);

		for (let y = 0; y < height; y++) {
			const l = 1 - y / (height - 1);
			const most = maxChroma(l, hue);
			for (let x = 0; x < width; x++) {
				const [r, g, b] = oklchToRgb([l, (x / (width - 1)) * most, hue]);
				const i = (y * width + x) * 4;
				image.data[i] = r;
				image.data[i + 1] = g;
				image.data[i + 2] = b;
				image.data[i + 3] = 255;
			}
		}
		context.putImageData(image, 0, 0);
	});

	function pick(event: PointerEvent) {
		if (!area) return;
		const box = area.getBoundingClientRect();
		set(1 - (event.clientY - box.top) / box.height, (event.clientX - box.left) / box.width);
	}

	function onpointerdown(event: PointerEvent) {
		area?.setPointerCapture(event.pointerId);
		area?.focus();
		pick(event);
	}

	function onpointermove(event: PointerEvent) {
		if (area?.hasPointerCapture(event.pointerId)) pick(event);
	}

	function onkeydown(event: KeyboardEvent) {
		const step = event.shiftKey ? 0.1 : 0.01;
		const moves: Record<string, [number, number]> = {
			ArrowRight: [lightness, saturation + step],
			ArrowLeft: [lightness, saturation - step],
			ArrowUp: [lightness + step, saturation],
			ArrowDown: [lightness - step, saturation]
		};
		const next = moves[event.key];
		if (!next) return;
		event.preventDefault();
		set(...next);
	}

	function commit() {
		if (adopt(draft)) emit();
		else draft = value;
	}
</script>

<div role="group" aria-label={label} class={cn('w-56 space-y-3', className)}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={area}
		role="slider"
		tabindex="0"
		aria-label="Saturation and lightness"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(saturation * 100)}
		aria-valuetext="Saturation {Math.round(saturation * 100)}%, lightness {Math.round(
			lightness * 100
		)}%"
		{onpointerdown}
		{onpointermove}
		{onkeydown}
		class={cn(
			'relative h-36 cursor-crosshair touch-none overflow-hidden rounded-md border border-border',
			focusRing
		)}
	>
		<canvas bind:this={canvas} width="64" height="64" class="size-full"></canvas>
		<span
			aria-hidden="true"
			class="pointer-events-none absolute size-4 -translate-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.35)]"
			style:left="{saturation * 100}%"
			style:top="{(1 - lightness) * 100}%"
			style:background-color={current}
		></span>
	</div>

	<input
		type="range"
		min="0"
		max="360"
		value={hue}
		oninput={(event) => set(lightness, saturation, event.currentTarget.valueAsNumber)}
		aria-label="Hue"
		class={cn('ck-hue h-3 w-full cursor-pointer appearance-none rounded-full', focusRing)}
	/>

	<div class="flex items-center gap-2">
		<span
			aria-hidden="true"
			class="size-8 shrink-0 rounded-md border border-border shadow-xs"
			style:background-color={current}
		></span>
		<input
			bind:value={draft}
			onchange={commit}
			aria-label="Color value"
			spellcheck="false"
			class={cn(
				'h-8 min-w-0 flex-1 rounded-md border border-border bg-surface px-2 font-mono text-[0.8125rem] text-fg shadow-xs',
				transition,
				focusRingInset
			)}
		/>
	</div>

	{#if swatches.length}
		<div class="flex flex-wrap gap-1.5">
			{#each swatches as swatch (swatch)}
				<button
					type="button"
					aria-label="Use {swatch}"
					onclick={() => adopt(swatch) && emit()}
					class={cn(
						'size-6 cursor-pointer rounded-md border border-border shadow-xs hover:scale-110',
						transition,
						focusRing
					)}
					style:background-color={swatch}
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.ck-hue {
		background: linear-gradient(
			to right,
			oklch(0.7 0.15 0),
			oklch(0.7 0.15 60),
			oklch(0.7 0.15 120),
			oklch(0.7 0.15 180),
			oklch(0.7 0.15 240),
			oklch(0.7 0.15 300),
			oklch(0.7 0.15 360)
		);
	}

	.ck-hue::-webkit-slider-thumb {
		appearance: none;
		width: 1rem;
		height: 1rem;
		border-radius: 9999px;
		border: 2px solid white;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.3),
			0 1px 3px rgb(0 0 0 / 0.35);
	}

	.ck-hue::-moz-range-thumb {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 9999px;
		border: 2px solid white;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.3),
			0 1px 3px rgb(0 0 0 / 0.35);
	}
</style>
