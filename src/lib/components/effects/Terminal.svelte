<script lang="ts" module>
	export interface TerminalLine {
		/** `command` lines are typed after the prompt; `output` lines appear whole. */
		kind?: 'command' | 'output';
		text: string;
		tone?: 'default' | 'muted' | 'success' | 'accent' | 'warning' | 'danger';
		/** Pause before this line, in milliseconds. Overrides `lineDelay`. */
		delay?: number;
	}
</script>

<script lang="ts">
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '../../utils/cn.js';
	import Caret from './Caret.svelte';

	interface Props {
		lines: TerminalLine[];
		/** Shown in the bar above the output, e.g. a working directory. */
		title?: string;
		prompt?: string;
		/** Milliseconds per typed character. */
		speed?: number;
		/** Default pause between lines. */
		lineDelay?: number;
		/** Start over a few seconds after the last line. */
		loop?: boolean;
		/** Wait until the terminal scrolls into view. */
		startOnView?: boolean;
		class?: string;
	}

	let {
		lines,
		title,
		prompt = '$',
		speed = 45,
		lineDelay = 300,
		loop = false,
		startOnView = true,
		class: className
	}: Props = $props();

	const tones = {
		default: '',
		muted: 'text-white/45',
		success: 'text-[var(--ck-code-string)]',
		accent: 'text-[var(--ck-code-keyword)]',
		warning: 'text-[var(--ck-code-attr)]',
		danger: 'text-[var(--ck-code-tag)]'
	};

	let element = $state<HTMLElement | null>(null);
	let started = $state(false);
	let shown = $state<{ line: TerminalLine; text: string }[]>([]);
	let typing = $state(false);

	$effect(() => {
		if (!startOnView) {
			started = true;
			return;
		}
		if (started || !element) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				started = true;
				observer.disconnect();
			},
			{ threshold: 0.5 }
		);
		observer.observe(element);
		return () => observer.disconnect();
	});

	$effect(() => {
		const script = lines;
		if (!started) return;

		if (prefersReducedMotion.current) {
			shown = script.map((line) => ({ line, text: line.text }));
			return;
		}

		let canceled = false;
		let timer: ReturnType<typeof setTimeout>;
		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				timer = setTimeout(resolve, ms);
			});

		async function play() {
			do {
				shown = [];
				for (const line of script) {
					await wait(line.delay ?? lineDelay);
					if (canceled) return;

					if (line.kind === 'command') {
						shown = [...shown, { line, text: '' }];
						typing = true;
						for (let i = 1; i <= line.text.length && !canceled; i++) {
							shown[shown.length - 1].text = line.text.slice(0, i);
							await wait(speed * (0.6 + Math.random() * 0.8));
						}
						typing = false;
					} else {
						shown = [...shown, { line, text: line.text }];
					}
				}
				if (loop) await wait(4000);
			} while (loop && !canceled);
		}

		play();
		return () => {
			canceled = true;
			clearTimeout(timer);
		};
	});
</script>

<div
	bind:this={element}
	class={cn(
		'overflow-hidden rounded-lg border border-white/10 bg-code-bg font-mono text-[0.8125rem] text-code-fg',
		className
	)}
>
	{#if title}
		<div class="border-b border-white/10 px-4 py-2 text-xs text-white/40">{title}</div>
	{/if}

	<pre class="sr-only">{lines
			.map((line) => (line.kind === 'command' ? `${prompt} ${line.text}` : line.text))
			.join('\n')}</pre>

	<!-- Space for every line up front, so the box does not grow while it types. -->
	<div
		aria-hidden="true"
		class="p-4 leading-[1.7] whitespace-pre-wrap"
		style:min-height="calc({lines.length} * 1.7em + 2rem)"
	>
		{#each shown as item, index (index)}
			<div>
				{#if item.line.kind === 'command'}<span class="text-white/35 select-none"
						>{`${prompt} `}</span
					>{/if}<span class={tones[item.line.tone ?? 'default']}>{item.text}</span
				>{#if index === shown.length - 1}<Caret blink={!typing} />{/if}
			</div>
		{:else}
			<Caret />
		{/each}
	</div>
</div>
