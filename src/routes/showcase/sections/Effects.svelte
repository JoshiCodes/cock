<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		Caret,
		CountUp,
		Highlight,
		Marquee,
		Odometer,
		Reveal,
		Scramble,
		Terminal,
		Typewriter,
		confetti
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './Effects.svelte?raw';
	import Demo from '../Demo.svelte';

	const moods = ['Asleep', 'Waking', 'Crowing', 'Awake'];
	let mood = $state(0);

	let eggs = $state(12840);
	let punctual = $state(99.95);

	let giggles = $state(1284);

	let revealKey = $state(0);
	// Bumping a key remounts its block, which replays a one-shot animation.
	let terminalRun = $state(0);
	let countRun = $state(0);
	let highlightRun = $state(0);

	const tags = [
		'SvelteKit',
		'Tailwind 4',
		'Runes',
		'OKLCH',
		'color-mix',
		'TypeScript',
		'Vite',
		'Bun',
		'GitHub Packages'
	];
</script>

<Section
	{source}
	id="effects"
	title="Effects"
	description="Small animated pieces for landing pages and empty states. All of them settle on the final text when the visitor prefers reduced motion, and screen readers get the full text instead of the animation. They all know when to stop."
>
	<Demo
		title="Terminal"
		description="Types commands, prints output. Waits until it is on screen before it starts."
		layout="bare"
	>
		{#key terminalRun}
			<Terminal
				title="~/farm"
				lines={[
					{ kind: 'command', text: 'bun run count-flock' },
					{ text: 'Coop 1  ......  6 hens', tone: 'muted' },
					{ text: 'Coop 2  ......  6 hens', tone: 'muted' },
					{ text: 'Rooster ......  on the roof again', tone: 'warning' },
					{ text: '12 of 12 accounted for', tone: 'success', delay: 600 }
				]}
			/>
		{/key}
		<Button size="sm" variant="outline" class="mt-4" onclick={() => terminalRun++}>Replay</Button>
	</Demo>

	<Demo
		title="Typewriter"
		description="Types, pauses, deletes and moves on. One string types once; an array cycles."
		layout="col"
	>
		<p class="text-2xl font-semibold tracking-tight text-fg">
			Wake up to <Typewriter
				text={['fresh eggs', 'a finished UI', 'a very loud bird', 'morning glory']}
				class="text-accent"
			/>
		</p>
		<p class="text-sm text-fg-muted">
			<Typewriter
				text="All twelve hens accounted for. Nothing else to do."
				speed={35}
				caretShape="block"
				loop
				pause={3000}
			/>
		</p>
	</Demo>

	<Demo
		title="Caret"
		description="The blinking bar on its own, for prompts and fake inputs. Stands up straight, never gets tired."
		layout="col"
	>
		<div class="rounded-md bg-code-bg px-4 py-3 font-mono text-sm text-code-fg">
			<span class="text-white/40">~/farm $</span> bun run dev<Caret />
		</div>
		<div class="flex items-center gap-8 text-lg text-fg">
			<span>bar<Caret /></span>
			<span>block<Caret shape="block" /></span>
			<span>underline<Caret shape="underline" class="bg-accent" /></span>
		</div>
	</Demo>

	<Demo
		title="Scramble"
		description="Settles from random glyphs into the text. Plays when it scrolls into view, on hover, or whenever the text changes."
	>
		<Badge variant="accent" class="font-mono">
			<Scramble text={moods[mood]} duration={600} />
		</Badge>
		<Button size="sm" variant="outline" onclick={() => (mood = (mood + 1) % moods.length)}>
			Next
		</Button>
		<span class="text-sm text-fg-muted">
			<Scramble text="Hover this line. It likes the attention." trigger="hover" class="font-mono" />
		</span>
	</Demo>

	<Demo
		title="CountUp"
		description="Counts to its value once it is on screen, and from the old value to the new one after that."
	>
		<div class="flex flex-wrap items-end gap-10">
			{#key countRun}
				<div>
					<p class="text-sm text-fg-muted">Eggs since March</p>
					<p class="text-3xl font-semibold tracking-tight text-fg">
						<CountUp value={eggs} locale="en-US" />
					</p>
				</div>
				<div>
					<p class="text-sm text-fg-muted">Mornings he was on time</p>
					<p class="text-3xl font-semibold tracking-tight text-fg">
						<CountUp value={punctual} decimals={2} suffix="%" />
					</p>
				</div>
			{/key}
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					eggs = Math.round(8000 + Math.random() * 20000);
					punctual = 95 + Math.random() * 5;
				}}
			>
				New numbers
			</Button>
			<Button size="sm" variant="ghost" onclick={() => countRun++}>Replay</Button>
		</div>
	</Demo>

	<Demo
		title="Odometer"
		description="Each digit rolls to its new value, like a mechanical counter."
	>
		<div>
			<p class="text-sm text-fg-muted">People who giggled at the package name</p>
			<p class="text-4xl font-semibold tracking-tight text-fg">
				<Odometer value={giggles} />
			</p>
		</div>
		<Button size="sm" variant="outline" onclick={() => (giggles += 1)}>Another one</Button>
		<Button size="sm" variant="ghost" onclick={() => (giggles += 37)}
			>Read it out in a meeting</Button
		>
	</Demo>

	<Demo
		title="Marquee"
		description="Scrolls its content in a loop and pauses on hover. Fills the width however short the content is. It just keeps going."
		layout="bare"
	>
		<div class="space-y-4 py-2">
			<Marquee gap="0.75rem">
				{#each tags as tag (tag)}
					<Badge variant="outline">{tag}</Badge>
				{/each}
			</Marquee>
			<Marquee gap="0.75rem" direction="right" speed={25}>
				{#each tags as tag (tag)}
					<Badge>{tag}</Badge>
				{/each}
			</Marquee>
		</div>
	</Demo>

	<Demo
		title="Highlight"
		description="A marker stroke that draws itself once the text is on screen."
		layout="col"
	>
		{#key highlightRun}
			<p class="max-w-xl text-lg leading-relaxed text-fg">
				Size isn't <Highlight>everything</Highlight>. It's
				<Highlight variant="underline" delay={400}>what you do with it</Highlight> that counts.
			</p>
		{/key}
		<Button size="sm" variant="outline" class="self-start" onclick={() => highlightRun++}>
			Replay
		</Button>
	</Demo>

	<Demo
		title="confetti()"
		description="A function, not a component. Bursts from an element or a point and cleans up after itself."
	>
		<Button onclick={(event) => confetti({ origin: event.currentTarget })}>Finish</Button>
		<Button variant="outline" onclick={() => confetti({ velocity: 17, count: 220 })}>
			From the middle
		</Button>
	</Demo>

	<Demo
		title="Reveal"
		description="Fades content in as it scrolls into view. Anything already visible on load is left alone."
		layout="col"
	>
		<div class="grid gap-4 sm:grid-cols-3">
			{#key revealKey}
				{#each ['Foreplay', 'Build', 'Ship'] as step, index (step)}
					<Reveal delay={index * 120} appear>
						<Card padding="md">
							<p class="text-sm text-fg-muted">Step {index + 1}</p>
							<p class="mt-1 font-medium text-fg">{step}</p>
						</Card>
					</Reveal>
				{/each}
			{/key}
		</div>
		<Button size="sm" variant="outline" class="self-start" onclick={() => revealKey++}
			>Replay</Button
		>
	</Demo>
</Section>
