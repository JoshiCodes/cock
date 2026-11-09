<script lang="ts">
	import { Button, Input, Select, SegmentedControl, Switch } from '@joshicodes/cock';
	import CodeBlock from '../showcase/CodeBlock.svelte';
	import type { Template, TemplateOption } from './registry.js';

	let { template }: { template: Template } = $props();

	let view = $state('preview');
	let viewport = $state('desktop');
	let scheme = $state('auto');
	let stage = $state<HTMLDivElement | null>(null);
	let fullscreen = $state(false);

	const widths: Record<string, string> = { desktop: '100%', tablet: '768px', mobile: '390px' };

	const defaults = $derived(
		Object.fromEntries((template.meta.options ?? []).map((option) => [option.name, option.default]))
	);
	let changed = $state<Record<string, string | boolean>>({});
	let values = $derived({ ...defaults, ...changed });
	const Demo = $derived(template.component);

	// A new template keeps nothing from the one before it.
	$effect.pre(() => {
		void template.slug;
		changed = {};
		view = 'preview';
	});

	function selectOptions(option: Extract<TemplateOption, { type: 'select' }>) {
		return option.options;
	}

	async function toggleFullscreen() {
		if (document.fullscreenElement) await document.exitFullscreen();
		else await stage?.requestFullscreen();
	}

	$effect(() => {
		const sync = () => (fullscreen = document.fullscreenElement === stage);
		document.addEventListener('fullscreenchange', sync);
		return () => document.removeEventListener('fullscreenchange', sync);
	});
</script>

<div class="overflow-hidden rounded-lg border border-border bg-bg shadow-sm">
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-3 py-2.5 sm:px-4"
	>
		<SegmentedControl
			bind:value={view}
			options={[
				{ value: 'preview', label: 'Preview' },
				{ value: 'code', label: 'Code' }
			]}
			label="Template view"
			size="sm"
		/>

		{#if view === 'preview'}
			<div class="flex flex-wrap items-center gap-2">
				<SegmentedControl
					bind:value={scheme}
					options={[
						{ value: 'auto', label: 'Auto' },
						{ value: 'light', label: 'Light' },
						{ value: 'dark', label: 'Dark' }
					]}
					label="Preview color scheme"
					size="sm"
				/>
				<SegmentedControl
					bind:value={viewport}
					options={[
						{ value: 'desktop', label: 'Desktop' },
						{ value: 'tablet', label: 'Tablet' },
						{ value: 'mobile', label: 'Phone' }
					]}
					label="Preview width"
					size="sm"
					class="max-md:hidden"
				/>
				<Button variant="ghost" size="sm" onclick={toggleFullscreen}>Full screen</Button>
			</div>
		{/if}
	</div>

	{#if view === 'preview' && template.meta.options?.length}
		<div
			class="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border px-3 py-3 sm:px-4"
		>
			{#each template.meta.options as option (option.name)}
				<label class="flex items-center gap-2 text-xs text-fg-muted">
					{#if option.type === 'boolean'}
						<Switch
							checked={Boolean(values[option.name])}
							onchange={(checked) => (changed[option.name] = checked)}
							aria-label={option.label}
							size="sm"
						/>
						{option.label}
					{:else if option.type === 'select'}
						{option.label}
						<Select
							value={String(values[option.name])}
							onchange={(event) => (changed[option.name] = event.currentTarget.value)}
							options={selectOptions(option)}
							size="sm"
							class="w-auto min-w-28"
						/>
					{:else}
						{option.label}
						<Input
							value={String(values[option.name])}
							oninput={(event) => (changed[option.name] = event.currentTarget.value)}
							placeholder={option.placeholder}
							size="sm"
							class="w-40"
						/>
					{/if}
				</label>
			{/each}
		</div>
	{/if}

	<div class:hidden={view !== 'preview'} class="stage overflow-x-auto">
		<div
			bind:this={stage}
			class="flex justify-center bg-muted/40 {fullscreen ? 'overflow-auto' : ''} {viewport ===
				'desktop' || fullscreen
				? ''
				: 'px-3 py-6 sm:px-6'}"
		>
			<div
				data-ck-theme={scheme === 'auto' ? undefined : scheme}
				class="w-full bg-bg text-fg transition-[max-width] duration-300 {viewport !== 'desktop' &&
				!fullscreen
					? 'overflow-hidden rounded-lg border border-border shadow-lg'
					: ''}"
				style:max-width={fullscreen ? '100%' : widths[viewport]}
			>
				<div
					class="@container grid"
					style:min-height={fullscreen ? '100vh' : `${template.meta.height ?? 420}px`}
				>
					<Demo {...values} />
				</div>
			</div>
		</div>
	</div>

	{#if view === 'code'}
		<CodeBlock code={template.source} label="{template.slug}.svelte" />
	{/if}
</div>
