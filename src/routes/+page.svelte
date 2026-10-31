<script lang="ts">
	import { Button, Marquee, Tab, TabList, TabPanel, Tabs, Terminal, cn } from '#lib';
	import CodeBlock from './showcase/CodeBlock.svelte';
	import Section from './showcase/Section.svelte';
	import Seo from './showcase/Seo.svelte';
	import { site as meta } from './seo.js';
	import { site } from './showcase/site.svelte.js';
	import Foundations from './showcase/sections/Foundations.svelte';
	import Primitives from './showcase/sections/Primitives.svelte';
	import LayoutSection from './showcase/sections/LayoutSection.svelte';
	import Forms from './showcase/sections/Forms.svelte';
	import Feedback from './showcase/sections/Feedback.svelte';
	import Overlays from './showcase/sections/Overlays.svelte';
	import Navigation from './showcase/sections/Navigation.svelte';
	import Data from './showcase/sections/Data.svelte';
	import Effects from './showcase/sections/Effects.svelte';

	// Labels here must match the section titles.
	const nav = [
		{ id: 'install', label: 'Install' },
		{ id: 'theme', label: 'Theme' },
		{ id: 'primitives', label: 'Primitives' },
		{ id: 'layout', label: 'Layout' },
		{ id: 'forms', label: 'Forms' },
		{ id: 'feedback', label: 'Feedback' },
		{ id: 'overlays', label: 'Overlays' },
		{ id: 'navigation', label: 'Navigation' },
		{ id: 'data', label: 'Data' },
		{ id: 'effects', label: 'Effects' }
	];

	const npmrc =
		'@joshicodes:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}';
	const yarnrc =
		'npmScopes:\n  joshicodes:\n    npmRegistryServer: "https://npm.pkg.github.com"\n    npmAuthToken: "${GITHUB_TOKEN}"';

	const managers = [
		{ id: 'bun', add: 'bun add @joshicodes/cock', config: npmrc, file: '.npmrc' },
		{ id: 'npm', add: 'npm install @joshicodes/cock', config: npmrc, file: '.npmrc' },
		{ id: 'pnpm', add: 'pnpm add @joshicodes/cock', config: npmrc, file: '.npmrc' },
		{ id: 'yarn', add: 'yarn add @joshicodes/cock', config: yarnrc, file: '.yarnrc.yml' }
	];

	function stepsFor(manager: (typeof managers)[number]) {
		return [
			{
				label: `Tell ${manager.id} where the scope lives, and how to get in`,
				file: manager.file,
				code: manager.config
			},
			{ label: 'Add the package', file: 'terminal', code: manager.add },
			{
				label: 'Import the tokens after Tailwind',
				file: 'app.css',
				code: "@import 'tailwindcss';\n@import '@joshicodes/cock/theme.css';"
			},
			{
				label: 'Use it. Responsibly.',
				file: '+page.svelte',
				code: "import { Button, Card, toast } from '@joshicodes/cock';"
			}
		];
	}

	// Remember the package manager between visits.
	let manager = $state('bun');
	$effect(() => {
		const saved = localStorage.getItem('ck-package-manager');
		if (saved && managers.some((m) => m.id === saved)) manager = saved;
	});
	$effect(() => {
		localStorage.setItem('ck-package-manager', manager);
	});

	const names = [
		'Button',
		'Terminal',
		'Modal',
		'Odometer',
		'Tabs',
		'CommandPalette',
		'Toast',
		'PinInput',
		'Field',
		'Heatmap',
		'Drawer',
		'Scramble',
		'Accordion',
		'TagInput',
		'Table',
		'Typewriter',
		'Tooltip',
		'Sparkline',
		'Switch',
		'confetti()'
	];

	let active = $state('install');

	// Scroll spy: the active section is the last one whose top has passed the
	// line just under the sticky header. Scroll events already arrive at most
	// once per frame, so there is nothing to throttle.
	$effect(() => {
		const update = () => {
			const line = 120;
			let current = nav[0].id;

			for (const item of nav) {
				const element = document.getElementById(item.id);
				if (element && element.getBoundingClientRect().top <= line) current = item.id;
			}

			// The last sections can be too short to ever reach the line.
			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
			if (atBottom) current = nav[nav.length - 1].id;

			active = current;
		};

		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);

		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<Seo
	structured={[
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareSourceCode',
			name: 'cock',
			alternateName: 'Core Component Kit',
			description: meta.description,
			url: meta.url,
			codeRepository: meta.repo,
			programmingLanguage: ['TypeScript', 'Svelte'],
			runtimePlatform: 'SvelteKit',
			license: 'https://opensource.org/licenses/MIT',
			author: { '@type': 'Person', ...meta.author }
		},
		{ '@context': 'https://schema.org', '@type': 'WebSite', name: meta.name, url: meta.url }
	]}
/>

<div class="border-b border-border">
	<div
		class="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-16 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:px-8 lg:pt-24 lg:pb-20"
	>
		<div>
			<h1
				class="max-w-xl text-4xl leading-[1.05] font-semibold tracking-tight text-fg sm:text-[3.5rem]"
			>
				Svelte components that are up before you are.
			</h1>

			<p class="mt-6 max-w-lg text-lg leading-relaxed text-fg-muted">
				Forms, dialogs, menus and tables with keyboard handling and dark mode already done. Restyle
				the lot with three CSS variables, or let the generator pick something for you.
			</p>

			<div class="mt-9 flex flex-wrap items-center gap-3">
				<Button size="lg" href="#primitives">Browse components</Button>
				<Button size="lg" variant="outline" href="/themes">Generate a theme</Button>
			</div>

			<p class="mt-8 text-sm text-fg-subtle">
				Big, juicy components. Size isn't everything, but 63 of them certainly help.
			</p>
		</div>

		<Terminal
			title="~/new-project"
			startOnView={false}
			lines={[
				{ kind: 'command', text: 'bun add @joshicodes/cock', delay: 600 },
				{ text: '+ @joshicodes/cock@0.1.0', tone: 'success' },
				{ text: '63 components, 2 dependencies, no surprises', tone: 'muted' },
				{ kind: 'command', text: 'bun run dev', delay: 900 },
				{ text: '  Local   http://localhost:5173', tone: 'muted' },
				{ text: 'cock-a-doodle-done in 412 ms', tone: 'accent', delay: 700 }
			]}
		/>
	</div>

	<Marquee class="border-t border-border py-4 text-sm text-fg-subtle" speed={30} gap="1.25rem">
		{#each names as name (name)}
			<span>{name}</span>
			<span aria-hidden="true" class="size-1 rounded-full bg-border-strong"></span>
		{/each}
	</Marquee>
</div>

<div class="mx-auto flex max-w-7xl gap-12 px-5 py-16 lg:px-8">
	<aside class="hidden w-44 shrink-0 lg:block">
		<nav class="sticky top-28">
			<p class="mb-3 text-sm font-medium text-fg">On this page</p>
			<ul class="border-l border-border">
				{#each nav as item (item.id)}
					<li>
						<a
							href="#{item.id}"
							aria-current={active === item.id ? 'location' : undefined}
							class={cn(
								'-ml-px block border-l py-1.5 pl-4 text-sm transition-colors',
								active === item.id
									? 'border-accent font-medium text-fg'
									: 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg'
							)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>

			<button
				type="button"
				onclick={() => (site.customizing = true)}
				class="mt-8 cursor-pointer text-sm text-fg-muted transition-colors hover:text-fg"
			>
				Customize the theme →
			</button>
		</nav>
	</aside>

	<main class="min-w-0 flex-1 space-y-24">
		<Section
			id="install"
			title="Install"
			description="Published to GitHub Packages, so your package manager needs to know where the scope lives and needs a token to get in. After that it installs in seconds. No performance anxiety."
		>
			<Tabs bind:value={manager} variant="pill" class="gap-6">
				<TabList>
					{#each managers as option (option.id)}
						<Tab value={option.id}>{option.id}</Tab>
					{/each}
				</TabList>

				{#each managers as option (option.id)}
					<TabPanel value={option.id}>
						<ol class="space-y-6">
							{#each stepsFor(option) as step, index (step.label)}
								<li>
									<p class="mb-2.5 text-[0.9375rem] text-fg">
										<span class="mr-1.5 text-fg-subtle tabular-nums">{index + 1}.</span>
										{step.label}
									</p>
									<div class="overflow-hidden rounded-lg border border-border">
										<CodeBlock code={step.code} label={step.file} />
									</div>
								</li>
							{/each}
						</ol>
					</TabPanel>
				{/each}
			</Tabs>

			<p class="text-sm leading-relaxed text-fg-muted">
				GITHUB_TOKEN is a personal access token with the read:packages scope. Always use protection:
				keep it in an environment variable, never in the repository.
			</p>
		</Section>

		<Foundations />
		<Primitives />
		<LayoutSection />
		<Forms />
		<Feedback />
		<Overlays />
		<Navigation />
		<Data />
		<Effects />
	</main>
</div>
