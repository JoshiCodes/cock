<script lang="ts">
	import { cn, Separator } from '#lib';
	import Section from '../Section.svelte';
	import source from './Foundations.svelte?raw';
	import Demo from '../Demo.svelte';
	import SwatchGrid from '../SwatchGrid.svelte';

	const surfaces = [
		{ name: 'Background', token: '--ck-bg', className: 'bg-bg' },
		{ name: 'Surface', token: '--ck-surface', className: 'bg-surface' },
		{ name: 'Muted', token: '--ck-muted', className: 'bg-muted' },
		{ name: 'Border', token: '--ck-border', className: 'bg-border' }
	];

	const text = [
		{ name: 'Foreground', token: '--ck-fg', className: 'bg-fg' },
		{ name: 'Muted', token: '--ck-fg-muted', className: 'bg-fg-muted' },
		{ name: 'Subtle', token: '--ck-fg-subtle', className: 'bg-fg-subtle' },
		{ name: 'Border strong', token: '--ck-border-strong', className: 'bg-border-strong' }
	];

	const status = [
		{ name: 'Accent', token: '--ck-accent', className: 'bg-accent' },
		{ name: 'Success', token: '--ck-success', className: 'bg-success' },
		{ name: 'Warning', token: '--ck-warning', className: 'bg-warning' },
		{ name: 'Danger', token: '--ck-danger', className: 'bg-danger' }
	];

	const type = [
		{ label: 'Display', className: 'text-4xl font-semibold tracking-tight' },
		{ label: 'Heading', className: 'text-2xl font-semibold tracking-tight' },
		{ label: 'Subheading', className: 'text-base font-semibold' },
		{ label: 'Body', className: 'text-sm' },
		{ label: 'Small', className: 'text-xs text-fg-muted' },
		{ label: 'Mono', className: 'font-mono text-sm' }
	];

	const radii = [
		'rounded-sm',
		'rounded-md',
		'rounded-lg',
		'rounded-xl',
		'rounded-2xl',
		'rounded-full'
	];
	const shadows = ['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg'];
</script>

<Section
	{source}
	id="theme"
	title="Theme"
	description="Three colours are set by hand. Surfaces, borders and secondary text are mixed from them with color-mix, so changing the background is enough to re-skin everything. It looks good in anything."
>
	<Demo title="Surfaces" layout="bare" code={false}>
		<SwatchGrid swatches={surfaces} />
	</Demo>

	<Demo title="Foreground" layout="bare" code={false}>
		<SwatchGrid swatches={text} />
	</Demo>

	<Demo title="Accent & status" layout="bare" code={false}>
		<SwatchGrid swatches={status} />
	</Demo>

	<Demo title="Type scale" layout="bare" code={false}>
		<div class="space-y-4">
			{#each type as item (item.label)}
				<div class="flex flex-wrap items-baseline gap-x-6 gap-y-1">
					<span class="w-28 shrink-0 text-sm text-fg-muted">
						{item.label}
					</span>
					<span class={item.className}>The quick brown fox</span>
				</div>
			{/each}
		</div>
	</Demo>

	<Demo title="Radius & elevation" layout="bare" code={false}>
		<div class="space-y-6">
			<div class="flex flex-wrap items-end gap-4">
				{#each radii as radius (radius)}
					<div class="space-y-2 text-center">
						<div class={cn('size-14 border border-border bg-muted', radius)}></div>
						<p class="font-mono text-[0.625rem] text-fg-subtle">{radius}</p>
					</div>
				{/each}
			</div>

			<Separator />

			<div class="flex flex-wrap items-end gap-4">
				{#each shadows as shadow (shadow)}
					<div class="space-y-2 text-center">
						<div class={cn('size-14 rounded-lg border border-border bg-surface', shadow)}></div>
						<p class="font-mono text-[0.625rem] text-fg-subtle">{shadow}</p>
					</div>
				{/each}
			</div>
		</div>
	</Demo>
</Section>
