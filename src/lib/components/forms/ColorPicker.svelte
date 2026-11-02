<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRing, focusRingInset, transition } from '../../utils/styles.js';
	import {
		fitToGamut,
		formatOklch,
		inGamut,
		oklchToHex,
		oklchToRgb,
		parseColor,
		type Oklch
	} from '../../utils/oklch.js';

	interface Props {
		/** An `oklch(…)` string. Hex is accepted too and converted on the first change. */
		value?: string;
		/** Colours offered as one-click choices, in any format `value` accepts. */
		swatches?: string[];
		/** Names the picker for screen readers. */
		label?: string;
		class?: string;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable('oklch(0.62 0.17 316)'),
		swatches = [],
		label = 'Colour',
		class: className,
		onchange
	}: Props = $props();

	/** Chroma at the right edge of the area. A little past sRGB, so the gamut edge shows. */
	const MAX_CHROMA = 0.37;

	let color = $state<Oklch>(parseColor(value) ?? [0.62, 0.17, 316]);
	let emitted = value;
	let draft = $state(value);

	// Someone else changed the value; follow it without echoing it back.
	$effect(() => {
		if (value === emitted) return;
		const parsed = parseColor(value);
		if (!parsed) return;
		color = parsed;
		emitted = value;
		draft = value;
	});

	function set(next: Oklch) {
		color = [
			Math.min(1, Math.max(0, next[0])),
			Math.min(MAX_CHROMA, Math.max(0, next[1])),
			((next[2] % 360) + 360) % 360
		];
		emitted = value = formatOklch(color);
		draft = value;
		onchange?.(value);
	}

	let [l, c, h] = $derived(color);
	let fits = $derived(inGamut(color));
	let hex = $derived(oklchToHex(color));
	let shown = $derived(formatOklch(color));

	/* -- the lightness × chroma area ---------------------------------------- */

	let canvas = $state<HTMLCanvasElement>();
	let area = $state<HTMLDivElement>();

	// Repainted whenever the hue moves. Small on purpose: CSS scales it up smoothly.
	$effect(() => {
		const context = canvas?.getContext('2d');
		if (!context || !canvas) return;
		const { width, height } = canvas;
		const image = context.createImageData(width, height);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const point: Oklch = [1 - y / (height - 1), (x / (width - 1)) * MAX_CHROMA, h];
				const visible = inGamut(point);
				const [r, g, b] = oklchToRgb(point);
				const i = (y * width + x) * 4;
				image.data[i] = r;
				image.data[i + 1] = g;
				image.data[i + 2] = b;
				// Outside sRGB is drawn faint, so the edge of what screens can show is visible.
				image.data[i + 3] = visible ? 255 : 70;
			}
		}
		context.putImageData(image, 0, 0);
	});

	function pick(event: PointerEvent) {
		if (!area) return;
		const box = area.getBoundingClientRect();
		const x = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
		const y = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
		set([1 - y, x * MAX_CHROMA, h]);
	}

	function onpointerdown(event: PointerEvent) {
		area?.setPointerCapture(event.pointerId);
		area?.focus();
		pick(event);
	}

	function onpointermove(event: PointerEvent) {
		if (area?.hasPointerCapture(event.pointerId)) pick(event);
	}

	function onareakeydown(event: KeyboardEvent) {
		const big = event.shiftKey ? 10 : 1;
		const moves: Record<string, Oklch> = {
			ArrowRight: [l, c + 0.005 * big, h],
			ArrowLeft: [l, c - 0.005 * big, h],
			ArrowUp: [l + 0.01 * big, c, h],
			ArrowDown: [l - 0.01 * big, c, h]
		};
		const next = moves[event.key];
		if (!next) return;
		event.preventDefault();
		set(next);
	}

	/* -- typed input -------------------------------------------------------- */

	function commit() {
		const parsed = parseColor(draft);
		if (parsed) set(parsed);
		else draft = value;
	}

	/** Lightness is typed as a percentage, the way most people think of it. */
	let channels = $derived([
		{ key: 'L', index: 0, value: +(l * 100).toFixed(1), max: 100, step: 0.5, scale: 100 },
		{ key: 'C', index: 1, value: +c.toFixed(3), max: MAX_CHROMA, step: 0.005, scale: 1 },
		{ key: 'H', index: 2, value: +h.toFixed(1), max: 360, step: 1, scale: 1 }
	] as const);

	function field(index: 0 | 1 | 2, raw: string, scale: number) {
		const number = parseFloat(raw);
		if (Number.isNaN(number)) return;
		const next = [...color] as Oklch;
		next[index] = number / scale;
		set(next);
	}

	const box = cn(
		'h-8 rounded-md border border-border bg-surface px-2 text-[0.8125rem] text-fg tabular-nums shadow-xs',
		transition,
		focusRingInset
	);
</script>

<div role="group" aria-label={label} class={cn('w-64 space-y-3', className)}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={area}
		role="slider"
		tabindex="0"
		aria-label="Lightness and chroma"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(l * 100)}
		aria-valuetext="Lightness {Math.round(l * 100)}%, chroma {c.toFixed(3)}{fits
			? ''
			: ', outside sRGB'}"
		{onpointerdown}
		{onpointermove}
		onkeydown={onareakeydown}
		class={cn(
			'relative h-40 cursor-crosshair touch-none overflow-hidden rounded-md border border-border',
			'[background:repeating-conic-gradient(var(--color-muted)_0_25%,transparent_0_50%)_0_0/12px_12px]',
			focusRing
		)}
	>
		<canvas bind:this={canvas} width="160" height="100" class="size-full"></canvas>
		<span
			aria-hidden="true"
			class="pointer-events-none absolute size-4 -translate-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.35),0_1px_3px_rgb(0_0_0/0.4)]"
			style:left="{(c / MAX_CHROMA) * 100}%"
			style:top="{(1 - l) * 100}%"
			style:background-color={shown}
		></span>
	</div>

	<input
		type="range"
		min="0"
		max="360"
		step="0.5"
		value={h}
		oninput={(event) => set([l, c, event.currentTarget.valueAsNumber])}
		aria-label="Hue"
		class={cn('ck-hue h-3 w-full cursor-pointer appearance-none rounded-full', focusRing)}
		style:--ck-hue-l={Math.max(0.55, Math.min(0.8, l))}
		style:--ck-hue-c={Math.max(0.12, Math.min(0.2, c))}
	/>

	<div class="flex items-center gap-2">
		<span
			aria-hidden="true"
			class="size-8 shrink-0 rounded-md border border-border shadow-xs"
			style:background-color={shown}
		></span>
		<input
			bind:value={draft}
			onchange={commit}
			onkeydown={(event) => event.key === 'Enter' && commit()}
			aria-label="Colour as oklch or hex"
			spellcheck="false"
			class={cn(box, 'min-w-0 flex-1 font-mono')}
		/>
	</div>

	<div class="grid grid-cols-3 gap-2">
		{#each channels as input (input.key)}
			<label class="flex items-center gap-1.5 text-xs text-fg-subtle">
				<span class="w-2.5 font-medium">{input.key}</span>
				<input
					type="number"
					min="0"
					max={input.max}
					step={input.step}
					value={input.value}
					onchange={(event) => field(input.index, event.currentTarget.value, input.scale)}
					class={cn(box, 'w-full min-w-0 px-1.5')}
				/>
			</label>
		{/each}
	</div>

	<div class="flex min-h-6 items-center justify-between gap-2 text-xs">
		<span class="font-mono text-fg-muted">{hex}</span>
		{#if !fits}
			<button
				type="button"
				onclick={() => set(fitToGamut(color))}
				class={cn('cursor-pointer rounded text-warning hover:underline', focusRing)}
				title="Most screens show the nearest sRGB colour instead"
			>
				Outside sRGB · fit it
			</button>
		{/if}
	</div>

	{#if swatches.length}
		<div class="flex flex-wrap gap-1.5">
			{#each swatches as swatch (swatch)}
				{@const parsed = parseColor(swatch)}
				{#if parsed}
					<button
						type="button"
						aria-label="Use {swatch}"
						aria-pressed={formatOklch(parsed) === shown}
						onclick={() => set(parsed)}
						class={cn(
							'size-6 cursor-pointer rounded-md border border-border shadow-xs aria-pressed:ring-2 aria-pressed:ring-accent aria-pressed:ring-offset-1 aria-pressed:ring-offset-surface',
							transition,
							focusRing
						)}
						style:background-color={formatOklch(parsed)}
					></button>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	/* The track shows every hue at roughly the current lightness, so it reads as a preview. */
	.ck-hue {
		background: linear-gradient(
			to right,
			oklch(var(--ck-hue-l) var(--ck-hue-c) 0),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 60),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 120),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 180),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 240),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 300),
			oklch(var(--ck-hue-l) var(--ck-hue-c) 360)
		);
	}

	.ck-hue::-webkit-slider-thumb {
		appearance: none;
		width: 1rem;
		height: 1rem;
		border-radius: 9999px;
		border: 2px solid white;
		background: transparent;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.35),
			0 1px 3px rgb(0 0 0 / 0.4);
	}

	.ck-hue::-moz-range-thumb {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 9999px;
		border: 2px solid white;
		background: transparent;
		box-shadow:
			0 0 0 1px rgb(0 0 0 / 0.35),
			0 1px 3px rgb(0 0 0 / 0.4);
	}
</style>
