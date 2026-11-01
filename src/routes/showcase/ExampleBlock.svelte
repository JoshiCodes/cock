<script lang="ts">
	import { slide } from 'svelte/transition';
	import { cn } from '@joshicodes/cock';
	import CodeBlock from './CodeBlock.svelte';
	import type { Example } from '../components/examples.js';

	let { example }: { example: Example } = $props();

	let showCode = $state(false);
	const Demo = $derived(example.component);
</script>

<section class="space-y-3">
	<div class="flex items-end justify-between gap-4">
		<div class="min-w-0">
			<h3 class="text-base font-semibold text-fg">{example.title}</h3>
			{#if example.description}
				<p class="mt-1 text-sm text-fg-muted">{example.description}</p>
			{/if}
		</div>

		<button
			type="button"
			onclick={() => (showCode = !showCode)}
			aria-expanded={showCode}
			class="shrink-0 cursor-pointer text-sm text-fg-muted transition-colors hover:text-fg"
		>
			{showCode ? 'Hide code' : 'Show code'}
		</button>
	</div>

	<div class="overflow-hidden rounded-lg border border-border">
		<div class={cn('flex flex-wrap items-center gap-3 bg-surface px-5 py-8')}>
			<Demo />
		</div>

		{#if showCode}
			<div transition:slide={{ duration: 180 }}>
				<CodeBlock code={example.source} class="border-t border-border" />
			</div>
		{/if}
	</div>
</section>
