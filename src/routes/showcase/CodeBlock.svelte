<script lang="ts">
	import { cn } from '#lib';
	import { highlight } from './highlight.js';

	interface Props {
		code: string;
		/** Label shown in the corner, e.g. a filename or language. */
		label?: string;
		class?: string;
	}

	let { code, label, class: className }: Props = $props();

	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}
</script>

<div class={cn('relative overflow-hidden bg-code-bg text-code-fg', className)}>
	<div class="absolute top-2 right-2 flex items-center gap-2">
		{#if label}
			<span class="font-mono text-xs text-white/35">{label}</span>
		{/if}
		<button
			type="button"
			onclick={copy}
			class="cursor-pointer rounded-md px-2 py-1 text-xs text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>

	<pre class="overflow-x-auto p-4 pr-24 font-mono text-[0.78rem] leading-[1.7]"><code
			>{@html highlight(code)}</code
		></pre>
</div>

<style>
	pre :global(.tok-comment) {
		color: var(--ck-code-comment);
		font-style: italic;
	}
	pre :global(.tok-string) {
		color: var(--ck-code-string);
	}
	pre :global(.tok-tag) {
		color: var(--ck-code-tag);
	}
	pre :global(.tok-block) {
		color: var(--ck-code-keyword);
	}
	pre :global(.tok-keyword) {
		color: var(--ck-code-keyword);
	}
	pre :global(.tok-attr) {
		color: var(--ck-code-attr);
	}
</style>
