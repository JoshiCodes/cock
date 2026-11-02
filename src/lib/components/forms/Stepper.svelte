<script lang="ts" module>
	export interface StepperStep {
		title: string;
		description?: string;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { focusRing, transition } from '../../utils/styles.js';
	import { uid } from '../../utils/id.js';
	import Button from '../primitives/Button.svelte';

	interface Props {
		steps: StepperStep[];
		/** Index of the step on screen, from 0. */
		current?: number;
		/** Only steps already reached can be jumped to. Turn off to allow any order. */
		linear?: boolean;
		/**
		 * Runs before moving on. Return `false` to stay put, e.g. while a field
		 * still has an error. May be async; the button waits and shows a spinner.
		 */
		validate?: (step: number) => boolean | Promise<boolean>;
		/** Runs when the last step is confirmed. May be async. */
		onfinish?: () => void | Promise<void>;
		backLabel?: string;
		nextLabel?: string;
		finishLabel?: string;
		class?: string;
		children: Snippet<[{ current: number }]>;
	}

	let {
		steps,
		current = $bindable(0),
		linear = true,
		validate,
		onfinish,
		backLabel = 'Back',
		nextLabel = 'Next',
		finishLabel = 'Finish',
		class: className,
		children
	}: Props = $props();

	const id = uid('stepper');

	let panel = $state<HTMLElement>();
	let busy = $state(false);
	let reached = $state(0);

	$effect(() => {
		if (current > reached) reached = current;
	});

	let last = $derived(current === steps.length - 1);

	async function go(index: number) {
		current = index;
		// People who navigate by keyboard or screen reader land on the new content.
		await tick();
		panel?.focus();
	}

	async function next() {
		busy = true;
		try {
			if (validate && !(await validate(current))) return;
			if (last) await onfinish?.();
			else await go(current + 1);
		} finally {
			busy = false;
		}
	}

	function reachable(index: number) {
		return !linear || index <= reached;
	}
</script>

<div class={cn('flex flex-col gap-6', className)}>
	<ol aria-label="Progress" class="flex items-start">
		{#each steps as step, index (index)}
			{@const done = index < current}
			{@const active = index === current}
			<li
				class={cn(
					'flex min-w-0 items-start',
					index < steps.length - 1 && 'flex-1',
					active && 'max-sm:flex-none'
				)}
			>
				<button
					type="button"
					disabled={!reachable(index) || busy}
					aria-current={active ? 'step' : undefined}
					onclick={() => go(index)}
					class={cn(
						'group flex min-w-0 cursor-pointer items-start gap-2.5 rounded-md text-left disabled:cursor-default',
						focusRing
					)}
				>
					<span
						class={cn(
							'flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium tabular-nums',
							transition,
							active && 'border-accent bg-accent text-accent-fg',
							done && 'border-accent/40 bg-accent/12 text-accent group-hover:bg-accent/20',
							!active && !done && 'border-border bg-surface text-fg-muted'
						)}
					>
						{#if done}
							<svg viewBox="0 0 24 24" fill="none" class="size-3.5" aria-hidden="true">
								<path
									d="m5 12.5 4.5 4.5L19 7.5"
									stroke="currentColor"
									stroke-width="2.25"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							<span class="sr-only">Done:</span>
						{:else}
							{index + 1}
						{/if}
					</span>

					<!-- On a phone only the current step keeps its title; the rest are numbers. -->
					<span class={cn('min-w-0 pt-1', !active && 'max-sm:sr-only')}>
						<span
							class={cn(
								'block truncate text-sm font-medium',
								active ? 'text-fg' : 'text-fg-muted group-enabled:group-hover:text-fg'
							)}
						>
							{step.title}
						</span>
						{#if step.description}
							<span class="block truncate text-xs text-fg-subtle max-sm:hidden">
								{step.description}
							</span>
						{/if}
					</span>
				</button>

				{#if index < steps.length - 1}
					<span
						aria-hidden="true"
						class={cn(
							'mx-3 mt-3.5 h-px min-w-4 flex-1',
							transition,
							done ? 'bg-accent/50' : 'bg-border'
						)}
					></span>
				{/if}
			</li>
		{/each}
	</ol>

	<section bind:this={panel} tabindex="-1" aria-labelledby="{id}-title" class="outline-none">
		<h3 id="{id}-title" class="sr-only">
			Step {current + 1} of {steps.length}: {steps[current]?.title}
		</h3>
		{@render children({ current })}
	</section>

	<div class="flex items-center justify-between gap-3">
		<Button variant="ghost" disabled={current === 0 || busy} onclick={() => go(current - 1)}>
			{backLabel}
		</Button>
		<Button loading={busy} onclick={next}>{last ? finishLabel : nextLabel}</Button>
	</div>
</div>
