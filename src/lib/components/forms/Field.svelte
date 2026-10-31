<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import Label from './Label.svelte';

	interface FieldSlotArgs {
		id: string;
		invalid: boolean;
		'aria-describedby': string | undefined;
	}

	interface Props {
		label?: string;
		/** Helper text under the control. Replaced by `error` when that is set. */
		description?: string;
		error?: string;
		required?: boolean;
		class?: string;
		children: Snippet<[FieldSlotArgs]>;
	}

	let { label, description, error, required = false, class: className, children }: Props = $props();

	const id = uid('field');
	const describedById = `${id}-desc`;

	let invalid = $derived(Boolean(error));
	let message = $derived(error ?? description);
</script>

<div class={cn('space-y-1.5', className)}>
	{#if label}
		<Label for={id} {required}>{label}</Label>
	{/if}

	{@render children({
		id,
		invalid,
		'aria-describedby': message ? describedById : undefined
	})}

	{#if message}
		<p
			id={describedById}
			class={cn('text-xs leading-relaxed', invalid ? 'text-danger' : 'text-fg-muted')}
		>
			{message}
		</p>
	{/if}
</div>
