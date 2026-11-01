<script lang="ts">
	import { Alert, Button, Code, Table } from '@joshicodes/cock';
	import CodeBlock from '../../showcase/CodeBlock.svelte';
	import Prose from '../../showcase/Prose.svelte';
	import Seo from '../../showcase/Seo.svelte';

	let { data } = $props();

	const base = `:root {
	--ck-bg: oklch(0.985 0 0);
	--ck-fg: oklch(0.205 0 0);
	--ck-accent: oklch(0.52 0.18 316);
}`;

	const customAccent = `:root {
	--ck-accent: #0d9488;
	--ck-accent-hover: #0f766e;
	--ck-accent-fg: #ffffff;
}`;

	const scoped = `<section data-ck-theme="dark" style="--ck-accent: oklch(0.75 0.15 160)">
	<Card>Dark, green, and only in here.</Card>
</section>`;

	const runtime = `import { theme } from '@joshicodes/cock';

theme.mode = 'dark';              // 'light' | 'dark' | 'system'
theme.toggle();
theme.accent = 'pine';            // a preset, or any name you defined

theme.setToken('--ck-bg', '#f6f5f2');          // the scheme on screen
theme.setToken('--ck-bg', '#101014', 'dark');  // or a specific one
theme.setSharedToken('--ck-radius-scale', '0'); // both schemes at once
theme.clearTokens();                            // back to the stylesheet`;

	const fonts = `:root {
	--ck-font-sans: 'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif;
	--ck-font-mono: 'JetBrains Mono', ui-monospace, monospace;
}`;

	const described: { token: string; what: string }[] = [
		{ token: '--ck-bg', what: 'The page colour before the accent is mixed in.' },
		{ token: '--ck-fg', what: 'Body text. Everything secondary is mixed from it.' },
		{ token: '--ck-accent', what: 'Buttons, focus rings, links, selected rows.' },
		{
			token: '--ck-accent-hover',
			what: 'The accent on hover. Not derived: contrast is a judgement call.'
		},
		{ token: '--ck-accent-fg', what: 'Text on top of the accent.' },
		{ token: '--ck-tint', what: 'How much accent reaches the neutrals. 0% gives a grey page.' },
		{
			token: '--ck-tint-base',
			what: 'What gets mixed in. Dark mode uses a deepened accent so the page keeps its weight.'
		},
		{
			token: '--ck-radius-scale',
			what: "Multiplies Tailwind's radius scale. 0 squares everything off."
		},
		{ token: '--ck-elevate', what: 'How far a raised surface lifts off the canvas.' },
		{ token: '--ck-success', what: 'Status colours. Plain values, not derived.' },
		{ token: '--ck-warning', what: '' },
		{ token: '--ck-danger', what: '' },
		{ token: '--ck-info', what: '' },
		{ token: '--ck-font-sans', what: 'Body and UI typeface.' },
		{ token: '--ck-font-mono', what: 'Used by Code, Kbd and Terminal.' }
	];

	const derivedDocs: Record<string, string> = {
		'--ck-canvas': 'The real page colour: --ck-bg with the tint mixed in.',
		'--ck-surface': 'Cards, inputs, menus — anything sitting on the canvas.',
		'--ck-muted': 'Quiet fills: hover states, table stripes, skeletons.',
		'--ck-border': 'Hairlines.',
		'--ck-border-strong': 'Borders that need to be seen, like a checkbox outline.',
		'--ck-fg-muted': 'Secondary text.',
		'--ck-fg-subtle': 'Placeholders and captions.',
		'--ck-accent-soft': 'The accent as a background tint.',
		'--ck-ring': 'Focus ring colour. Follows the accent unless you set it.'
	};

	let handSet = $derived(described.filter((entry) => entry.token in data.light));
	let mixRatios = $derived(
		Object.keys(data.light).filter((token) => token.startsWith('--ck-mix-'))
	);
</script>

<Seo
	title="Theming"
	path="/docs/theming"
	description="Theme the cock component kit by setting three CSS variables. Derived tokens, accent presets, scoped themes and the runtime theme API."
/>

<Prose>
	<h1 class="text-3xl font-semibold tracking-tight text-fg">Theming</h1>
	<p class="text-lg">
		Three colours are set by hand. Surfaces, borders and secondary text are mixed from them with
		<Code>color-mix</Code>, so changing the background re-skins everything that sits on it.
	</p>

	<h2 id="basics">The three colours</h2>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={base} label="src/app.css" />
	</div>
	<p>
		That is a complete theme. Put the same three inside <Code>.dark</Code> for the dark scheme and you
		are done.
	</p>

	<h2 id="tokens">Tokens you set</h2>
	<p>Defaults below are the light scheme, read from the stylesheet that ships with the package.</p>
	<div class="mt-5">
		<Table>
			<thead>
				<tr>
					<th class="w-56">Token</th>
					<th>Default</th>
					<th>What it does</th>
				</tr>
			</thead>
			<tbody>
				{#each handSet as entry (entry.token)}
					<tr>
						<td class="align-top"><Code>{entry.token}</Code></td>
						<td class="align-top">
							<code class="font-mono text-xs break-words text-fg-muted"
								>{data.light[entry.token]}</code
							>
						</td>
						<td class="align-top text-sm text-fg-muted">{entry.what}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</div>
	<p>
		The contrast ratios are tokens too: {mixRatios
			.map((token) => token.replace('--ck-mix-', ''))
			.join(', ')}
		control how far each derived colour sits from the canvas. Raise them for more contrast, lower them
		for a flatter look.
	</p>

	<h2 id="derived">Tokens you get</h2>
	<p>
		These are mixed from the three above and recomputed wherever a theme is declared. Override one
		and the formula steps aside for that value.
	</p>
	<div class="mt-5">
		<Table>
			<thead>
				<tr>
					<th class="w-56">Token</th>
					<th>Mixed from</th>
					<th>Used for</th>
				</tr>
			</thead>
			<tbody>
				{#each Object.entries(data.derived) as [token, value] (token)}
					<tr>
						<td class="align-top"><Code>{token}</Code></td>
						<td class="align-top">
							<code class="font-mono text-xs break-words text-fg-muted">{value}</code>
						</td>
						<td class="align-top text-sm text-fg-muted">{derivedDocs[token] ?? ''}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</div>
	<p>
		Every one of them reaches Tailwind as a utility: <Code>bg-surface</Code>,
		<Code>text-fg-muted</Code>, <Code>border-border</Code>, <Code>bg-accent/12</Code>.
	</p>

	<h2 id="accent">A custom accent</h2>
	<p>
		Set the hover shade and the text colour alongside it. Neither is derived, because readable
		contrast on a coloured button is a decision rather than a formula.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={customAccent} label="src/app.css" />
	</div>
	<p>
		Six presets ship with the kit — <Code>plum</Code> (the default), <Code>cobalt</Code>,
		<Code>pine</Code>, <Code>ember</Code>, <Code>gold</Code> and <Code>ink</Code>. Set
		<Code>data-accent</Code> on <Code>&lt;html&gt;</Code>, or assign <Code>theme.accent</Code> at runtime.
	</p>

	<h2 id="fonts">Typeface</h2>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={fonts} label="src/app.css" />
	</div>

	<h2 id="scoped">Themes on part of a page</h2>
	<p>
		Put <Code>data-ck-theme</Code> on any element and that subtree gets its own theme. Set
		<Code>--ck-*</Code> variables on it and the derived tokens are recomputed there, which is how the
		<a href="/themes">theme generator</a> shows light and dark side by side on one page.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={scoped} label="anywhere.svelte" />
	</div>
	<Alert variant="warning" title="Overlays escape the subtree" class="mt-6">
		<Code>Modal</Code>, <Code>Drawer</Code>, <Code>DropdownMenu</Code>, <Code>Popover</Code> and
		<Code>Tooltip</Code> render into <Code>&lt;body&gt;</Code>, so they follow the page theme rather
		than the section they were opened from.
	</Alert>

	<h2 id="contrast">Contrast</h2>
	<p>
		The defaults clear WCAG AA in both schemes: body text at 16.8:1 and 17.4:1, secondary text above
		6:1, placeholder text above 4.5:1, and control outlines above 3:1. Two of the mix ratios —
		<Code>--ck-mix-border-strong</Code> and <Code>--ck-mix-fg-subtle</Code> — are set exactly where they
		clear those thresholds, so lowering them for a softer look is a trade you are making knowingly.
	</p>
	<p>
		A custom accent is the easy thing to get wrong, because <Code>--ck-accent-fg</Code> has to work on
		top of it and the accent itself has to work as link text. The
		<a href="/themes">theme generator</a> measures both, on the colours the browser actually paints, and
		can keep rolling until everything passes.
	</p>

	<h2 id="runtime">At runtime</h2>
	<p>
		The <Code>theme</Code> object is plain runes state. Changes persist to local storage and the page
		crossfades rather than snapping.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={runtime} label="anywhere.ts" />
	</div>
	<p>
		<Code>theme.resolved</Code> is always <Code>'light'</Code> or <Code>'dark'</Code>, even when the
		mode is <Code>'system'</Code>. <Code>theme.revision</Code> changes on every applied theme, which is
		the thing to watch if you measure computed styles yourself.
	</p>

	<div class="mt-10 flex flex-wrap gap-3">
		<Button href="/themes">Generate a theme</Button>
		<Button variant="outline" href="/components">Browse components</Button>
	</div>
</Prose>
