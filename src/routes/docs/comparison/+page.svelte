<script lang="ts">
	import { Alert, Button, Code, Table } from '@joshicodes/cock';
	import Prose from '../../showcase/Prose.svelte';
	import Seo from '../../showcase/Seo.svelte';
	import { bundle, stats } from '../../facts.js';

	const rivals = [
		{
			name: 'cock',
			href: '/',
			delivery: 'npm dependency',
			styling: 'Tailwind 4, included',
			theming: 'Three CSS variables, the rest mixed with color-mix',
			scope: `${stats.components} components, including motion effects`
		},
		{
			name: 'shadcn-svelte',
			href: 'https://www.shadcn-svelte.com',
			delivery: 'A CLI copies the source into your repo',
			styling: 'Tailwind, yours to edit after copying',
			theming: 'CSS variables in the copied files',
			scope: 'Large, built on Bits UI'
		},
		{
			name: 'Bits UI',
			href: 'https://bits-ui.com',
			delivery: 'npm dependency',
			styling: 'None. Headless by design',
			theming: 'Whatever you write',
			scope: 'Behaviour and accessibility primitives'
		},
		{
			name: 'Skeleton',
			href: 'https://www.skeleton.dev',
			delivery: 'npm dependency',
			styling: 'Tailwind, with its own utility layer',
			theming: 'A theme engine with prebuilt themes',
			scope: 'Design system plus components, several frameworks'
		}
	];
</script>

<Seo
	title="How it compares"
	path="/docs/comparison"
	description="Where the cock component kit sits next to shadcn-svelte, Bits UI and Skeleton, with measured bundle sizes and an honest look at what it does not do."
/>

<Prose>
	<h1 class="text-3xl font-semibold tracking-tight text-fg">How it compares</h1>
	<p class="text-lg">
		Svelte has good component libraries already. This one exists because none of them worked the way
		I wanted to start a project, not because they are bad. Here is the honest version of where it
		sits.
	</p>

	<h2 id="table">The shape of each one</h2>
	<div class="mt-5">
		<Table>
			<thead>
				<tr>
					<th class="w-36">Project</th>
					<th>How you get it</th>
					<th>Styling</th>
					<th>Theming</th>
				</tr>
			</thead>
			<tbody>
				{#each rivals as item (item.name)}
					<tr aria-selected={item.name === 'cock'}>
						<td class="align-top font-medium">
							<a href={item.href} class="hover:text-accent">{item.name}</a>
							<p class="mt-1 text-xs font-normal text-fg-subtle">{item.scope}</p>
						</td>
						<td class="align-top text-sm text-fg-muted">{item.delivery}</td>
						<td class="align-top text-sm text-fg-muted">{item.styling}</td>
						<td class="align-top text-sm text-fg-muted">{item.theming}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</div>

	<h2 id="difference">The actual difference</h2>
	<p>
		<strong class="font-medium text-fg">Styled, and a dependency.</strong> shadcn-svelte hands you
		the source and you own it from then on, which is excellent when you want to rewrite a component
		and awkward when you want an update. This kit is a normal package: you upgrade it and every
		screen moves with it. The escape hatch is the <Code>class</Code> prop, merged through tailwind-merge,
		so overriding a default never means forking a file.
	</p>
	<p>
		<strong class="font-medium text-fg">Theming is three variables.</strong> Not a theme file, not a
		generator step, not a build plugin: set <Code>--ck-bg</Code>, <Code>--ck-fg</Code> and
		<Code>--ck-accent</Code>, and surfaces, borders, hover states and secondary text are mixed from
		them at paint time. That is also why a themed subtree works at all.
	</p>
	<p>
		<strong class="font-medium text-fg">Motion is included.</strong> Typewriter, terminal, counters,
		marquee, reveal and confetti usually mean another dependency. They are in here, and they all
		settle on their final state under <Code>prefers-reduced-motion</Code>.
	</p>

	<h2 id="not">What it is not</h2>
	<ul>
		<li>
			<strong class="font-medium text-fg">Not headless.</strong> It has opinions about how things look.
			If you want behaviour with no styling, Bits UI is the better answer, and this kit does not try to
			compete with it.
		</li>
		<li>
			<strong class="font-medium text-fg">Not as deep on hard widgets.</strong> There is no combobox,
			date picker, virtualised list or tree. Those are months of accessibility work each, and the libraries
			above have already done it.
		</li>
		<li>
			<strong class="font-medium text-fg">Not battle-tested.</strong> It is new, and it is largely one
			person's taste. The bits that exist are tested by use rather than by a suite.
		</li>
		<li>
			<strong class="font-medium text-fg">Not framework-agnostic.</strong> Svelte 5 and Tailwind 4, nothing
			else.
		</li>
	</ul>

	<Alert variant="info" title="A reasonable combination" class="mt-6">
		Nothing stops you using this for layout, forms and feedback, and reaching for Bits UI the day
		you need a real combobox. They do not fight: this kit styles its own elements and does not touch
		Tailwind's class names.
	</Alert>

	<h2 id="size">Size, measured</h2>
	<p>
		Every row is a real bundle: a Vite library build against the published package, minified, Svelte
		treated as external, then gzipped. Measured on {bundle.measuredAt} against version {bundle.version}.
	</p>
	<div class="mt-5">
		<Table>
			<thead>
				<tr>
					<th>What was imported</th>
					<th class="w-24 text-right">Raw</th>
					<th class="w-24 text-right">Gzipped</th>
				</tr>
			</thead>
			<tbody>
				{#each bundle.rows as row (row.label)}
					<tr>
						<td class="text-sm">{row.label}</td>
						<td class="text-right tabular-nums">{row.raw.toFixed(1)} kB</td>
						<td class="text-right font-medium tabular-nums">{row.gzip.toFixed(1)} kB</td>
					</tr>
				{/each}
				<tr>
					<td class="text-sm">theme.css, the whole token layer</td>
					<td class="text-right tabular-nums">{bundle.css.raw.toFixed(1)} kB</td>
					<td class="text-right font-medium tabular-nums">{bundle.css.gzip.toFixed(1)} kB</td>
				</tr>
			</tbody>
		</Table>
	</div>
	<p>
		Most of the first component is the shared baseline: <Code>clsx</Code> and
		<Code>tailwind-merge</Code> together are {bundle.rows[0].gzip} kB gzipped, and every component after
		that adds about {stats.perComponentGzipKb} kB. Tree-shaking works because the package is ESM with
		no side effects outside CSS — importing <Code>Button</Code> does not drag in the command palette.
	</p>
	<p>
		The Tailwind classes the components use are compiled into your stylesheet by your own build, so
		they cost what they cost in your project. The numbers above are the JavaScript.
	</p>

	<h2 id="rendering">Rendering and SSR</h2>
	<ul>
		<li>
			Everything renders on the server. This documentation site is prerendered to static HTML, which
			is the proof: view the source of any component page.
		</li>
		<li>
			The effects render their final content on the server and start animating once the browser
			takes over, so there is no empty box in the HTML.
		</li>
		<li>
			The one thing a server cannot do is read local storage, which is what the
			<a href="/docs/getting-started#dark-mode">theme hook</a> is for.
		</li>
		<li>
			No runtime CSS-in-JS and no style injection: the classes are static strings, resolved by
			Tailwind at build time.
		</li>
	</ul>

	<div class="mt-10 flex flex-wrap gap-3">
		<Button href="/docs/getting-started">Install it</Button>
		<Button variant="outline" href="/components">Browse components</Button>
	</div>
</Prose>
