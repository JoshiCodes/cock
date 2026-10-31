<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export interface Command {
		id: string;
		label: string;
		/** Commands with the same group are listed under one heading. */
		group?: string;
		/** Shown on the right, usually a shortcut. */
		hint?: string;
		/** Extra words that should find this command. */
		keywords?: string[];
		icon?: Snippet;
		disabled?: boolean;
		onselect: () => void;
	}
</script>

<script lang="ts">
	import { tick } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { cn } from '../../utils/cn.js';
	import { uid } from '../../utils/id.js';
	import { lockScroll } from '../../utils/scrollLock.js';
	import { onHotkey } from '../../utils/hotkey.js';
	import { portal } from '../../actions/portal.js';
	import { trapFocus } from '../../actions/trapFocus.js';
	import Kbd from '../primitives/Kbd.svelte';

	interface Props {
		open?: boolean;
		commands: Command[];
		placeholder?: string;
		/** Toggles the palette from anywhere. `false` turns it off. */
		shortcut?: string | false;
		empty?: string;
		class?: string;
	}

	let {
		open = $bindable(false),
		commands,
		placeholder = 'Type a command or search…',
		shortcut = 'mod+k',
		empty = 'Nothing matches that.',
		class: className
	}: Props = $props();

	const listId = uid('palette');

	let query = $state('');
	let active = $state(0);
	let list = $state<HTMLElement | null>(null);

	/**
	 * Higher is better, -1 is no match. A plain substring beats a scattered
	 * match, and a match at the start of a word beats one in the middle.
	 */
	function score(text: string, search: string): number {
		const haystack = text.toLowerCase();
		const at = haystack.indexOf(search);
		if (at !== -1) {
			const wordStart = at === 0 || /\W/.test(haystack[at - 1]);
			return 1000 - at + (wordStart ? 200 : 0);
		}

		let position = 0;
		let points = 0;
		let streak = 0;
		for (const char of search) {
			const found = haystack.indexOf(char, position);
			if (found === -1) return -1;
			streak = found === position ? streak + 1 : 0;
			points += 10 + streak * 5;
			position = found + 1;
		}
		return points;
	}

	let results = $derived.by(() => {
		const search = query.trim().toLowerCase();
		if (!search) return commands;

		return commands
			.map((command) => ({
				command,
				score: Math.max(
					score(command.label, search),
					...(command.keywords ?? []).map((word) => score(word, search) - 50)
				)
			}))
			.filter((entry) => entry.score >= 0)
			.sort((a, b) => b.score - a.score)
			.map((entry) => entry.command);
	});

	// Group for display, keeping each command's position in the flat list for the keyboard.
	let groups = $derived.by(() => {
		const map = new Map<string, { command: Command; index: number }[]>();
		results.forEach((command, index) => {
			const key = command.group ?? '';
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push({ command, index });
		});
		return [...map.entries()].map(([name, items]) => ({ name, items }));
	});

	function close() {
		open = false;
	}

	function select(command: Command | undefined) {
		if (!command || command.disabled) return;
		close();
		command.onselect();
	}

	function move(by: number) {
		if (results.length === 0) return;
		active = (active + by + results.length) % results.length;
	}

	function onkeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				break;
			case 'Enter':
				event.preventDefault();
				select(results[active]);
				break;
			case 'Escape':
				event.preventDefault();
				close();
				break;
		}
	}

	$effect(() => {
		if (!shortcut) return;
		return onHotkey(shortcut, () => (open = !open));
	});

	$effect(() => {
		if (!open) return;
		query = '';
		active = 0;
		return lockScroll();
	});

	// A new search starts at the top.
	$effect(() => {
		query;
		active = 0;
	});

	$effect(() => {
		const index = active;
		tick().then(() => {
			list?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' });
		});
	});
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]" use:portal>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-fg/20 backdrop-blur-[2px] dark:bg-black/60"
			transition:fade={{ duration: 120 }}
			onclick={close}
		></div>

		<div
			role="dialog"
			aria-modal="true"
			aria-label="Command palette"
			use:trapFocus
			transition:scale={{ duration: 150, start: 0.97, opacity: 0 }}
			class={cn(
				'relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
				className
			)}
		>
			<div class="flex items-center gap-3 border-b border-border px-4">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					class="size-4.5 shrink-0 text-fg-subtle"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75" />
					<path d="m16 16 4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
				</svg>
				<input
					bind:value={query}
					{onkeydown}
					{placeholder}
					role="combobox"
					aria-expanded="true"
					aria-controls={listId}
					aria-autocomplete="list"
					aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
					autocomplete="off"
					spellcheck="false"
					class="h-13 min-w-0 flex-1 bg-transparent text-[0.9375rem] text-fg outline-none placeholder:text-fg-subtle"
				/>
				<Kbd>Esc</Kbd>
			</div>

			<div
				bind:this={list}
				id={listId}
				role="listbox"
				class="max-h-[min(24rem,55vh)] overflow-y-auto p-1.5"
			>
				{#if results.length === 0}
					<p class="px-3 py-10 text-center text-sm text-fg-muted">{empty}</p>
				{:else}
					{#each groups as group (group.name)}
						{#if group.name}
							<div
								role="presentation"
								class="px-2.5 pt-2.5 pb-1 text-xs font-medium text-fg-subtle"
							>
								{group.name}
							</div>
						{/if}
						{#each group.items as { command, index } (command.id)}
							<!-- Keyboard input goes through the search field, as the combobox pattern expects. -->
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<div
								id="{listId}-{index}"
								role="option"
								tabindex="-1"
								aria-selected={index === active}
								aria-disabled={command.disabled || undefined}
								data-index={index}
								onpointermove={() => (active = index)}
								onclick={() => select(command)}
								class={cn(
									'flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
									index === active ? 'bg-muted text-fg' : 'text-fg-muted',
									command.disabled && 'cursor-not-allowed opacity-50'
								)}
							>
								{#if command.icon}
									<span class="flex size-4 shrink-0 items-center justify-center text-fg-subtle">
										{@render command.icon()}
									</span>
								{/if}
								<span class="flex-1 truncate">{command.label}</span>
								{#if command.hint}
									<span class="text-xs text-fg-subtle tabular-nums">{command.hint}</span>
								{/if}
							</div>
						{/each}
					{/each}
				{/if}
			</div>

			<div
				class="flex items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-fg-subtle"
			>
				<span class="flex items-center gap-1.5"><Kbd>↑</Kbd><Kbd>↓</Kbd> move</span>
				<span class="flex items-center gap-1.5"><Kbd>↵</Kbd> select</span>
			</div>
		</div>
	</div>
{/if}
