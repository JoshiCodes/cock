<script lang="ts" module>
	export interface ComboboxOption {
		value: string;
		label: string;
		/** Extra words that should find this option, e.g. a country's ISO code. */
		keywords?: string[];
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import { anchored } from '../../utils/anchor.js';
	import { portal } from '../../actions/portal.js';

	interface Props extends Omit<
		HTMLInputAttributes,
		'class' | 'value' | 'size' | 'type' | 'multiple' | 'children'
	> {
		options: ComboboxOption[];
		/** A string, or an array of strings with `multiple`. */
		value?: string | string[];
		/** Pick several; they show as chips and Backspace removes the last one. */
		multiple?: boolean;
		/** Shows a button that empties the selection. */
		clearable?: boolean;
		/** Replaces the built-in matching, which ignores case and accents. */
		filter?: (option: ComboboxOption, query: string) => boolean;
		/** Shown when nothing matches what was typed. */
		empty?: string;
		size?: 'sm' | 'md' | 'lg';
		invalid?: boolean;
		class?: string;
		/** Custom rendering for a row in the list. */
		item?: Snippet<[ComboboxOption]>;
	}

	let {
		options,
		value = $bindable(),
		multiple = false,
		clearable = false,
		filter,
		empty = 'No matches',
		size = 'md',
		invalid = false,
		disabled = false,
		placeholder,
		name,
		id = uid('combobox'),
		class: className,
		item,
		...rest
	}: Props = $props();

	let input = $state<HTMLInputElement>();
	let field = $state<HTMLDivElement>();
	let list = $state<HTMLUListElement>();
	let width = $state(0);

	let open = $state(false);
	let query = $state('');
	/** Only filter once the person has typed; reopening shows everything. */
	let typed = $state(false);
	let active = $state(-1);

	let selected = $derived(
		multiple
			? Array.isArray(value)
				? value
				: []
			: typeof value === 'string' && value
				? [value]
				: []
	);
	let selectedOptions = $derived(
		selected
			.map((v) => options.find((option) => option.value === v))
			.filter((option) => option !== undefined)
	);

	const fold = (text: string) =>
		text
			.normalize('NFD')
			.replace(/\p{Diacritic}/gu, '')
			.toLowerCase();

	function matches(option: ComboboxOption, text: string) {
		const needle = fold(text.trim());
		return [option.label, ...(option.keywords ?? [])].some((hay) => fold(hay).includes(needle));
	}

	let filtered = $derived(
		typed && query.trim() ? options.filter((option) => (filter ?? matches)(option, query)) : options
	);

	// A single combobox shows its choice in the input whenever the list is shut.
	$effect(() => {
		if (!multiple && !open) query = selectedOptions[0]?.label ?? '';
	});

	$effect(() => {
		if (!open || active < 0) return;
		list?.querySelector(`#${id}-option-${active}`)?.scrollIntoView({ block: 'nearest' });
	});

	function firstEnabled(from: number, step: 1 | -1) {
		for (let i = from; i >= 0 && i < filtered.length; i += step) {
			if (!filtered[i].disabled) return i;
		}
		return -1;
	}

	function show() {
		if (disabled || open) return;
		open = true;
		typed = false;
		const current = filtered.findIndex((option) => option.value === selected[0]);
		active = current >= 0 ? current : firstEnabled(0, 1);
	}

	function hide() {
		open = false;
		typed = false;
		if (multiple) query = '';
	}

	function move(step: 1 | -1) {
		const next = firstEnabled(active + step, step);
		if (next >= 0) active = next;
	}

	function choose(option: ComboboxOption) {
		if (option.disabled) return;
		if (!multiple) {
			value = option.value;
			hide();
			return;
		}
		value = selected.includes(option.value)
			? selected.filter((v) => v !== option.value)
			: [...selected, option.value];
		query = '';
		typed = false;
		input?.focus();
	}

	function remove(v: string) {
		value = selected.filter((s) => s !== v);
	}

	function clear() {
		value = multiple ? [] : '';
		query = '';
		input?.focus();
	}

	function oninput() {
		typed = true;
		open = true;
		active = firstEnabled(0, 1);
	}

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (open) move(1);
				else show();
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (open) move(-1);
				else show();
				break;
			case 'Enter':
				if (!open || active < 0) return;
				event.preventDefault();
				choose(filtered[active]);
				break;
			case 'Escape':
				if (!open) return;
				// Stop here, or the Modal or Drawer around this closes too.
				event.preventDefault();
				event.stopPropagation();
				hide();
				break;
			case 'Backspace':
				if (multiple && query === '' && selected.length) remove(selected[selected.length - 1]);
				break;
			case 'Tab':
				hide();
				break;
		}
	}

	/** Clicks on the field but outside the input still focus it, and keep it focused. */
	function onfieldpointerdown(event: PointerEvent) {
		if (disabled || event.target === input) return;
		event.preventDefault();
		input?.focus();
		if (open) hide();
		else show();
	}

	const sizes = {
		sm: 'min-h-8 gap-1 pl-2.5 pr-2 text-[0.8125rem]',
		md: 'min-h-9 gap-1.5 pl-3 pr-2.5 text-sm',
		lg: 'min-h-11 gap-1.5 pl-4 pr-3 text-[0.9375rem]'
	};
</script>

<!-- The input is the control; the box around it only forwards presses to it. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={field}
	bind:offsetWidth={width}
	onpointerdown={onfieldpointerdown}
	class={cn(
		'flex w-full cursor-text items-center rounded-md border border-border bg-surface text-fg shadow-xs',
		'focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25',
		multiple && 'flex-wrap py-1',
		transition,
		sizes[size],
		invalid && 'border-danger focus-within:border-danger focus-within:ring-danger/25',
		disabled && 'cursor-not-allowed bg-muted opacity-60',
		className
	)}
>
	{#if multiple}
		{#each selectedOptions as option (option.value)}
			<span
				class="inline-flex h-6 items-center gap-1 rounded bg-muted pr-1 pl-2 text-[0.8125rem] text-fg"
			>
				{option.label}
				<button
					type="button"
					tabindex="-1"
					aria-label="Remove {option.label}"
					{disabled}
					onpointerdown={(event) => event.stopPropagation()}
					onclick={() => remove(option.value)}
					class="cursor-pointer rounded-sm p-0.5 text-fg-subtle hover:bg-border hover:text-fg"
				>
					<svg viewBox="0 0 24 24" fill="none" class="size-3" aria-hidden="true">
						<path
							d="m6 6 12 12M18 6 6 18"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</span>
		{/each}
	{/if}

	<input
		bind:this={input}
		bind:value={query}
		{id}
		{disabled}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-autocomplete="list"
		aria-expanded={open}
		aria-controls="{id}-list"
		aria-activedescendant={open && active >= 0 ? `${id}-option-${active}` : undefined}
		aria-invalid={invalid || undefined}
		placeholder={multiple && selected.length ? undefined : placeholder}
		{...rest}
		{oninput}
		{onkeydown}
		onclick={show}
		onblur={hide}
		class="h-6 min-w-16 flex-1 bg-transparent outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed"
	/>

	{#if clearable && selected.length && !disabled}
		<button
			type="button"
			tabindex="-1"
			aria-label="Clear"
			onpointerdown={(event) => event.stopPropagation()}
			onclick={clear}
			class="cursor-pointer rounded-sm p-0.5 text-fg-subtle hover:text-fg"
		>
			<svg viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
				<path
					d="m6 6 12 12M18 6 6 18"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	{/if}

	<svg
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
		class={cn(
			'size-4 shrink-0 text-fg-subtle transition-transform duration-150',
			open && 'rotate-180'
		)}
	>
		<path
			d="m7 10 5 5 5-5"
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>

	{#each name ? selected : [] as v (v)}
		<input type="hidden" {name} value={v} />
	{/each}
</div>

{#if open}
	<!-- Pressing inside the list must not take focus from the input. -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:portal
		use:anchored={{ to: field, placement: 'bottom-start', offset: 4 }}
		onpointerdown={(event) => event.preventDefault()}
		transition:fade={{ duration: 100 }}
		style:width="{width}px"
		class="z-50 overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
	>
		<ul
			bind:this={list}
			id="{id}-list"
			role="listbox"
			aria-multiselectable={multiple || undefined}
			class="max-h-64 overflow-y-auto p-1"
		>
			{#each filtered as option, index (option.value)}
				{@const isSelected = selected.includes(option.value)}
				<!-- The input handles the keyboard; these only need the pointer. -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id="{id}-option-{index}"
					role="option"
					aria-selected={isSelected}
					aria-disabled={option.disabled || undefined}
					onclick={() => choose(option)}
					onpointermove={() => !option.disabled && (active = index)}
					class={cn(
						'flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-fg select-none',
						index === active && 'bg-muted',
						option.disabled && 'cursor-not-allowed opacity-50'
					)}
				>
					<span class="min-w-0 flex-1 truncate">
						{#if item}{@render item(option)}{:else}{option.label}{/if}
					</span>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						aria-hidden="true"
						class={cn('size-4 shrink-0 text-accent', !isSelected && 'invisible')}
					>
						<path
							d="m5 12.5 4.5 4.5L19 7.5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</li>
			{/each}
		</ul>

		{#if !filtered.length}
			<p class="px-3.5 pt-1 pb-3 text-sm text-fg-muted">{empty}</p>
		{/if}
	</div>
{/if}
