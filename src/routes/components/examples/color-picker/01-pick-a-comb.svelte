<!-- Drag, slide or type. A bigger comb will not help, but a redder one might. -->
<script lang="ts">
	import { ColorPicker } from '@joshicodes/cock';

	let comb = $state('oklch(0.58 0.21 27)');

	const swatches = [
		'oklch(0.58 0.21 27)',
		'oklch(0.66 0.19 45)',
		'oklch(0.84 0.16 88)',
		'oklch(0.52 0.18 316)',
		'oklch(0.55 0.15 250)'
	];
</script>

<div class="flex w-full flex-wrap items-center gap-8">
	<ColorPicker bind:value={comb} {swatches} label="Comb colour" />

	<svg viewBox="0 0 64 64" class="size-28" aria-hidden="true">
		<path
			d="M18 26c-2-8 3-14 7-11 0-6 6-9 9-4 2-5 9-5 9 2 5-2 9 3 6 8"
			fill={comb}
			stroke="var(--color-fg)"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
		<path
			d="M16 30c0-4 4-6 8-6h16c6 0 10 4 10 10v8c0 8-6 14-16 14S16 50 16 42Z"
			fill="var(--color-surface)"
			stroke="var(--color-fg)"
			stroke-width="1.5"
		/>
		<circle cx="38" cy="34" r="2" fill="var(--color-fg)" />
		<path
			d="M50 36l8 3-8 3"
			fill="oklch(0.84 0.16 88)"
			stroke="var(--color-fg)"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
		<path
			d="M44 46c0 5-3 8-6 8 1-3 1-6 0-8Z"
			fill={comb}
			stroke="var(--color-fg)"
			stroke-width="1.5"
		/>
	</svg>
</div>
