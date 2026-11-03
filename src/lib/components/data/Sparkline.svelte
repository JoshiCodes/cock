<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';

	interface Props {
		data: number[];
		/** Drawn height in pixels; the width follows the container. */
		height?: number;
		/** Fill the area under the line with a fade. */
		fill?: boolean;
		/** Mark the last value with a dot. */
		dot?: boolean;
		strokeWidth?: number;
		/** How the points are joined: straight lines, a smooth curve, or steps. */
		curve?: 'linear' | 'smooth' | 'step';
		/** Bottom of the scale. Defaults to the smallest value. */
		min?: number;
		/** Top of the scale. Defaults to the largest value. */
		max?: number;
		/** Draws a dashed reference line at this value, e.g. a target or last year's average. */
		baseline?: number;
		/** Draws the line in from the left when it first appears. */
		animate?: boolean;
		/** Describe the trend for screen readers, e.g. "Up 12% this week". */
		label?: string;
		/** Color comes from `currentColor`; the default is the accent. */
		class?: string;
	}

	let {
		data,
		height = 32,
		fill = true,
		dot = true,
		strokeWidth = 1.75,
		curve = 'linear',
		min: minProp,
		max: maxProp,
		baseline,
		animate = false,
		label,
		class: className
	}: Props = $props();

	const gradient = uid('spark');
	const clip = uid('spark-clip');
	// A fixed coordinate space; the SVG stretches horizontally to fit.
	const width = 100;

	// The baseline is part of the range, so a target above every value is still drawn.
	let low = $derived(minProp ?? Math.min(...data, ...(baseline != null ? [baseline] : [])));
	let high = $derived(maxProp ?? Math.max(...data, ...(baseline != null ? [baseline] : [])));

	const pad = $derived(strokeWidth + 1);

	function y(value: number) {
		const span = high - low || 1;
		const clamped = Math.min(high, Math.max(low, value));
		return pad + (1 - (clamped - low) / span) * (height - pad * 2);
	}

	let points = $derived(
		data.map((value, i): [number, number] => [
			data.length === 1 ? width / 2 : (i / (data.length - 1)) * width,
			y(value)
		])
	);

	function path(pts: [number, number][]): string {
		if (!pts.length) return '';
		const [first, ...rest] = pts;
		const start = `M${first[0]} ${first[1]}`;
		if (curve === 'step') {
			// Holds each value until the next one, the way a meter reading changes.
			return start + rest.map(([x, yy], i) => ` L${x} ${pts[i][1]} L${x} ${yy}`).join('');
		}
		if (curve === 'smooth') {
			// Catmull-Rom through every point, written as cubic Béziers.
			return (
				start +
				rest
					.map(([x, yy], i) => {
						const p0 = pts[i - 1] ?? pts[i];
						const p1 = pts[i];
						const p3 = pts[i + 2] ?? [x, yy];
						const c1 = [p1[0] + (x - p0[0]) / 6, p1[1] + (yy - p0[1]) / 6];
						const c2 = [x - (p3[0] - p1[0]) / 6, yy - (p3[1] - p1[1]) / 6];
						return ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${x} ${yy}`;
					})
					.join('')
			);
		}
		return start + rest.map(([x, yy]) => ` L${x} ${yy}`).join('');
	}

	let line = $derived(path(points));
	let area = $derived(points.length ? `${line} L${width} ${height} L0 ${height} Z` : '');
	let reference = $derived(baseline != null ? y(baseline) : null);

	// Nothing moves for visitors who asked their system for less motion.
	let drawIn = $state(false);
	$effect(() => {
		drawIn = animate && !matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
	let last = $derived(points.at(-1));
</script>

<span
	role="img"
	aria-label={label}
	class={cn('relative block w-full text-accent', className)}
	style:height="{height}px"
>
	<svg
		viewBox="0 0 {width} {height}"
		preserveAspectRatio="none"
		class="absolute inset-0 size-full overflow-visible"
		aria-hidden="true"
	>
		<defs>
			{#if fill}
				<linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
				</linearGradient>
			{/if}
			{#if drawIn}
				<clipPath id={clip}>
					<rect x="-10" y="-10" height={height + 20} width="0">
						<animate
							attributeName="width"
							from="0"
							to={width + 20}
							dur="0.9s"
							fill="freeze"
							calcMode="spline"
							keySplines="0.2 0 0.2 1"
						/>
					</rect>
				</clipPath>
			{/if}
		</defs>

		{#if reference != null}
			<line
				x1="0"
				x2={width}
				y1={reference}
				y2={reference}
				stroke="currentColor"
				stroke-opacity="0.45"
				stroke-width="1"
				stroke-dasharray="3 3"
				vector-effect="non-scaling-stroke"
			/>
		{/if}

		<g clip-path={drawIn ? `url(#${clip})` : undefined}>
			{#if fill && area}
				<path d={area} fill="url(#{gradient})" />
			{/if}
			<path
				d={line}
				fill="none"
				stroke="currentColor"
				stroke-width={strokeWidth}
				stroke-linejoin="round"
				stroke-linecap="round"
				vector-effect="non-scaling-stroke"
			/>
		</g>
	</svg>

	{#if dot && last}
		<!-- Positioned in CSS so it stays round while the SVG stretches. -->
		<span
			class={cn(
				'absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current ring-2 ring-[var(--ck-surface)]',
				drawIn && 'animate-[ck-spark-dot_0.3s_0.8s_both]'
			)}
			style:left="{last[0]}%"
			style:top="{(last[1] / height) * 100}%"
		></span>
	{/if}
</span>

<style>
	@keyframes -global-ck-spark-dot {
		from {
			opacity: 0;
			scale: 0;
		}
	}
</style>
