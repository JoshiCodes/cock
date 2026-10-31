<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';

	interface Props {
		value?: string[];
		placeholder?: string;
		/** Stop accepting tags at this many. */
		max?: number;
		allowDuplicates?: boolean;
		/** Return false to reject a tag. */
		validate?: (tag: string) => boolean;
		disabled?: boolean;
		invalid?: boolean;
		id?: string;
		class?: string;
		onchange?: (tags: string[]) => void;
	}

	let {
		value = $bindable([]),
		placeholder = 'Add a tag…',
		max,
		allowDuplicates = false,
		validate,
		disabled = false,
		invalid = false,
		id,
		class: className,
		onchange
	}: Props = $props();

	let draft = $state('');
	let input = $state<HTMLInputElement | null>(null);
	// Feedback for a tag that was not added, so Enter never looks like it did nothing.
	let echo = $state<number | null>(null);
	let refused = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	let full = $derived(max !== undefined && value.length >= max);

	function signal(duplicate: number | null) {
		clearTimeout(timer);
		echo = duplicate;
		refused = duplicate === null;
		timer = setTimeout(() => {
			echo = null;
			refused = false;
		}, 700);
	}

	function add(raw: string) {
		const tag = raw.trim();
		if (!tag) return false;

		const existing = value.indexOf(tag);
		if (!allowDuplicates && existing !== -1) {
			signal(existing);
			return false;
		}
		if (full || (validate && !validate(tag))) {
			signal(null);
			return false;
		}

		value = [...value, tag];
		onchange?.(value);
		return true;
	}

	function remove(index: number) {
		value = value.filter((_, i) => i !== index);
		onchange?.(value);
		input?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		// Enter also confirms an IME composition; that one is not ours.
		if (event.isComposing) return;
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault();
			if (add(draft)) draft = '';
		} else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
			remove(value.length - 1);
		}
	}

	function onpaste(event: ClipboardEvent) {
		const text = event.clipboardData?.getData('text') ?? '';
		if (!/[,\n]/.test(text)) return;
		event.preventDefault();
		for (const part of text.split(/[,\n]/)) add(part);
	}
</script>

<!-- Clicking anywhere in the box focuses the text field. -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	onclick={() => input?.focus()}
	class={cn(
		'flex min-h-9 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5 shadow-xs',
		'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25',
		disabled && 'pointer-events-none opacity-60',
		(invalid || refused) && 'border-danger focus-within:border-danger focus-within:ring-danger/25',
		transition,
		className
	)}
>
	{#each value as tag, index (tag + index)}
		<span
			class={cn(
				'inline-flex h-6 items-center gap-1 rounded-sm border border-border bg-muted pr-1 pl-2 text-xs font-medium text-fg',
				transition,
				echo === index && 'border-warning bg-warning/15'
			)}
		>
			{tag}
			<button
				type="button"
				onclick={(event) => {
					event.stopPropagation();
					remove(index);
				}}
				aria-label="Remove {tag}"
				class="inline-flex size-4 cursor-pointer items-center justify-center rounded-xs text-fg-subtle hover:bg-border hover:text-fg"
			>
				<svg viewBox="0 0 24 24" fill="none" class="size-3" aria-hidden="true">
					<path
						d="m7 7 10 10M17 7 7 17"
						stroke="currentColor"
						stroke-width="2.25"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</span>
	{/each}

	<input
		bind:this={input}
		bind:value={draft}
		{id}
		{onkeydown}
		{onpaste}
		onblur={() => add(draft) && (draft = '')}
		placeholder={full ? '' : placeholder}
		disabled={disabled || full}
		aria-invalid={invalid || undefined}
		class="h-6 min-w-24 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
	/>
</div>
