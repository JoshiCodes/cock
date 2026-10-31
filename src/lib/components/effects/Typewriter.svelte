<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';
	import Caret from './Caret.svelte';

	interface Props {
		/** One string, or several to cycle through. */
		text: string | string[];
		/** Milliseconds per typed character. */
		speed?: number;
		/** Milliseconds per deleted character. */
		deleteSpeed?: number;
		/** How long a finished string stays before it is deleted. */
		pause?: number;
		/** Wait before the first character. */
		delay?: number;
		/** Keep cycling. Defaults to true when there is more than one string. */
		loop?: boolean;
		/** Vary the rhythm a little instead of typing like a metronome. */
		humanize?: boolean;
		/** Reserve the width of the longest string so surrounding text does not move. */
		reserve?: boolean;
		caret?: boolean;
		caretShape?: 'bar' | 'block' | 'underline';
		/** Remove the caret once the last string is typed and nothing else will happen. */
		hideCaretWhenDone?: boolean;
		class?: string;
		caretClass?: string;
		oncomplete?: () => void;
	}

	let {
		text,
		speed = 55,
		deleteSpeed = 28,
		pause = 1800,
		delay = 0,
		loop,
		humanize = true,
		reserve = false,
		caret = true,
		caretShape = 'bar',
		hideCaretWhenDone = false,
		class: className,
		caretClass,
		oncomplete
	}: Props = $props();

	let strings = $derived(Array.isArray(text) ? text : [text]);
	let longest = $derived(strings.reduce((a, b) => (b.length > a.length ? b : a), ''));

	let shown = $state('');
	let typing = $state(false);
	let done = $state(false);

	$effect(() => {
		const list = strings;
		const repeat = loop ?? list.length > 1;

		if (prefersReducedMotion.current) {
			shown = list[0] ?? '';
			typing = false;
			done = true;
			return;
		}

		let cancelled = false;
		let timer: ReturnType<typeof setTimeout>;
		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				timer = setTimeout(resolve, ms);
			});
		const beat = (ms: number) => (humanize ? ms * (0.55 + Math.random() * 0.9) : ms);

		shown = '';
		done = false;

		async function run() {
			await wait(delay);
			let index = 0;

			while (!cancelled) {
				const target = list[index] ?? '';

				typing = true;
				for (let i = 1; i <= target.length && !cancelled; i++) {
					shown = target.slice(0, i);
					await wait(beat(speed));
				}
				typing = false;
				if (cancelled) return;

				if (index === list.length - 1 && !repeat) {
					done = true;
					oncomplete?.();
					return;
				}

				await wait(pause);

				typing = true;
				for (let i = target.length - 1; i >= 0 && !cancelled; i--) {
					shown = target.slice(0, i);
					await wait(deleteSpeed);
				}
				typing = false;

				await wait(speed * 5);
				index = (index + 1) % list.length;
			}
		}

		run();

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	let showCaret = $derived(caret && !(done && hideCaretWhenDone));
</script>

<span class={cn(reserve && 'inline-grid', className)}>
	<span class="sr-only">{strings.join(', ')}</span>

	{#if reserve}
		<span aria-hidden="true" class="invisible col-start-1 row-start-1">{longest}</span>
	{/if}

	<span aria-hidden="true" class={cn(reserve && 'col-start-1 row-start-1')}
		>{shown}{#if showCaret}<Caret
				shape={caretShape}
				blink={!typing}
				class={caretClass}
			/>{/if}</span
	>
</span>
