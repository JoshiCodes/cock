<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import { transition } from '../../utils/styles.js';

	interface Props {
		/** The files chosen so far, in the order they were picked. */
		files?: File[];
		/** Same syntax as the native attribute: `.png,.jpg` or `image/*`. */
		accept?: string;
		multiple?: boolean;
		disabled?: boolean;
		/** Line under the heading, usually what you accept and how big. */
		hint?: string;
		/** Runs with the files that passed `accept`, dropped or picked. */
		onselect?: (files: File[]) => void;
		/** Replaces the default wording inside the box. */
		children?: Snippet;
		class?: string;
	}

	let {
		files = $bindable([]),
		accept,
		multiple = false,
		disabled = false,
		hint,
		onselect,
		children,
		class: className
	}: Props = $props();

	const id = uid('filedrop');
	const hintId = `${id}-hint`;

	// dragleave fires when the pointer crosses onto a child, so a flag would
	// flicker. Counting the enters and leaves does not.
	let depth = $state(0);
	let dragging = $derived(depth > 0);

	/** The browser only enforces `accept` in its own dialog, never on a drop. */
	function accepted(file: File): boolean {
		if (!accept) return true;

		return accept.split(',').some((rule) => {
			const pattern = rule.trim().toLowerCase();
			if (!pattern) return false;
			if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern);
			if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
			return file.type.toLowerCase() === pattern;
		});
	}

	function take(list: FileList | null) {
		if (disabled || !list) return;

		const picked = Array.from(list).filter(accepted);
		if (picked.length === 0) return;

		files = multiple ? [...files, ...picked] : [picked[0]];
		onselect?.(files);
	}

	function ondrop(event: DragEvent) {
		event.preventDefault();
		depth = 0;
		take(event.dataTransfer?.files ?? null);
	}
</script>

<label
	for={id}
	ondragenter={(event) => {
		event.preventDefault();
		depth += 1;
	}}
	ondragleave={() => (depth = Math.max(0, depth - 1))}
	ondragover={(event) => event.preventDefault()}
	{ondrop}
	class={cn(
		'flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-6 py-8 text-center',
		'focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
		transition,
		disabled
			? 'cursor-not-allowed border-border bg-muted opacity-60'
			: 'cursor-pointer border-border-strong bg-surface hover:border-accent hover:bg-muted/50',
		dragging && !disabled && 'border-accent bg-accent/10',
		className
	)}
>
	<input
		{id}
		type="file"
		{accept}
		{multiple}
		{disabled}
		aria-describedby={hint ? hintId : undefined}
		onchange={(event) => {
			take(event.currentTarget.files);
			// Let the same file be picked again after it was removed.
			event.currentTarget.value = '';
		}}
		class="sr-only"
	/>

	{#if children}
		{@render children()}
	{:else}
		<svg viewBox="0 0 24 24" fill="none" class="size-6 text-fg-subtle" aria-hidden="true">
			<path
				d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<p class="text-sm font-medium text-fg">
			{dragging
				? 'Let go'
				: multiple
					? 'Drop files here, or browse'
					: 'Drop a file here, or browse'}
		</p>
		{#if hint}
			<p id={hintId} class="text-xs text-fg-subtle">{hint}</p>
		{/if}
	{/if}
</label>
