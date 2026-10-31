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
		/** Describe the trend for screen readers, e.g. "Up 12% this week". */
		label?: string;
		/** Colour comes from `currentColor`; the default is the accent. */
		class?: string;
	}

	let {
		data,
		height = 32,
		fill = true,
		dot = true,
		strokeWidth = 1.75,
		label,
		class: className
	}: Props = $props();

	const gradient = uid('spark');
	// A fixed coordinate space; the SVG stretches horizontally to fit.
	const width = 100;

	let points = $derived.by(() => {
		if (data.length === 0) return [] as [number, number][];
		const min = Math.min(...data);
		const max = Math.max(...data);
		const span = max - min || 1;
		const pad = strokeWidth + 1;
		return data.map((value, i): [number, number] => [
			data.length === 1 ? width / 2 : (i / (data.length - 1)) * width,
			pad + (1 - (value - min) / span) * (height - pad * 2)
		]);
	});

	let line = $derived(points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '));
	let area = $derived(points.length ? `${line} L${width} ${height} L0 ${height} Z` : '');
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
		{#if fill && area}
			<defs>
				<linearGradient id={gradient} x1="0" x2="0" y1="0" y2="1">
					<stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
					<stop offset="100%" stop-color="currentColor" stop-opacity="0" />
				</linearGradient>
			</defs>
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
	</svg>

	{#if dot && last}
		<!-- Positioned in CSS so it stays round while the SVG stretches. -->
		<span
			class="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current ring-2 ring-[var(--ck-surface)]"
			style:left="{last[0]}%"
			style:top="{(last[1] / height) * 100}%"
		></span>
	{/if}
</span>
