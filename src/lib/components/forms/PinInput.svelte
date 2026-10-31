<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { focusRingInset, transition } from '../../utils/styles.js';

	interface Props {
		value?: string;
		length?: number;
		type?: 'numeric' | 'alphanumeric';
		/** Hide the characters, like a password field. */
		mask?: boolean;
		/** Put a small gap after this many boxes, e.g. 3 for "123 456". */
		group?: number;
		disabled?: boolean;
		invalid?: boolean;
		/** Accessible name for the whole group. */
		label?: string;
		class?: string;
		oncomplete?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		length = 6,
		type = 'numeric',
		mask = false,
		group,
		disabled = false,
		invalid = false,
		label = 'Verification code',
		class: className,
		oncomplete
	}: Props = $props();

	let boxes = $state<HTMLInputElement[]>([]);

	let chars = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));

	const allowed = (char: string) => (type === 'numeric' ? /^\d$/ : /^[a-z0-9]$/i).test(char);

	function commit(next: string[]) {
		value = next.join('').slice(0, length);
		if (value.length === length && next.every(Boolean)) oncomplete?.(value);
	}

	/** Write characters from `start` onwards; used for typing, paste and autofill alike. */
	function fill(start: number, input: string) {
		const incoming = [...input].filter(allowed);
		if (incoming.length === 0) return;
		const next = [...chars];
		let index = start;
		for (const char of incoming) {
			if (index >= length) break;
			next[index++] = type === 'alphanumeric' ? char.toUpperCase() : char;
		}
		commit(next);
		boxes[Math.min(index, length - 1)]?.focus();
	}

	function oninput(index: number, event: Event & { currentTarget: HTMLInputElement }) {
		const typed = event.currentTarget.value;
		// Put back what the state says; `fill` decides what actually changes.
		event.currentTarget.value = chars[index];
		fill(index, chars[index] ? typed.replace(chars[index], '') || typed : typed);
	}

	function onkeydown(index: number, event: KeyboardEvent) {
		if (event.key === 'Backspace') {
			event.preventDefault();
			const next = [...chars];
			if (next[index]) {
				next[index] = '';
			} else if (index > 0) {
				next[index - 1] = '';
				boxes[index - 1]?.focus();
			}
			commit(next);
		} else if (event.key === 'ArrowLeft' && index > 0) {
			event.preventDefault();
			boxes[index - 1]?.focus();
		} else if (event.key === 'ArrowRight' && index < length - 1) {
			event.preventDefault();
			boxes[index + 1]?.focus();
		}
	}

	function onpaste(index: number, event: ClipboardEvent) {
		event.preventDefault();
		fill(index, event.clipboardData?.getData('text') ?? '');
	}
</script>

<div role="group" aria-label={label} class={cn('flex items-center gap-2', className)}>
	{#each chars as char, index (index)}
		{#if group && index > 0 && index % group === 0}
			<span class="h-px w-2.5 bg-border-strong" aria-hidden="true"></span>
		{/if}
		<input
			bind:this={boxes[index]}
			value={char}
			type={mask ? 'password' : 'text'}
			inputmode={type === 'numeric' ? 'numeric' : 'text'}
			autocomplete={index === 0 ? 'one-time-code' : 'off'}
			aria-label="Character {index + 1} of {length}"
			aria-invalid={invalid || undefined}
			{disabled}
			oninput={(event) => oninput(index, event)}
			onkeydown={(event) => onkeydown(index, event)}
			onpaste={(event) => onpaste(index, event)}
			onfocus={(event) => event.currentTarget.select()}
			class={cn(
				'size-11 rounded-md border border-border bg-surface text-center text-lg font-medium text-fg caret-accent shadow-[inset_0_-1px_0_var(--ck-border)]',
				'disabled:cursor-not-allowed disabled:opacity-60',
				transition,
				focusRingInset,
				char && 'border-border-strong',
				invalid && 'border-danger focus-visible:border-danger focus-visible:ring-danger/25'
			)}
		/>
	{/each}
</div>
