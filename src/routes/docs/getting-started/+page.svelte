<script lang="ts">
	import { Alert, Button, Code } from '@joshicodes/cock';
	import CodeBlock from '../../showcase/CodeBlock.svelte';
	import InstallTabs from '../../showcase/InstallTabs.svelte';
	import Prose from '../../showcase/Prose.svelte';
	import Seo from '../../showcase/Seo.svelte';

	const tailwind = `@import 'tailwindcss';
@import '@joshicodes/cock/theme.css';`;

	const hook = `// src/hooks.server.ts
export { themeHandle as handle } from '@joshicodes/cock';`;

	const sequence = `import { sequence } from '@sveltejs/kit/hooks';
import { themeHandle } from '@joshicodes/cock';

export const handle = sequence(themeHandle, myOwnHandle);`;

	const manual =
		`<!-- src/app.html, inside <head> -->
<script>%cock.theme%<` + `/script>`;

	const manualHook = `import { themeScript } from '@joshicodes/cock';

export const handle = async ({ event, resolve }) =>
	resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%cock.theme%', themeScript)
	});`;

	const layout =
		`<script lang="ts">
	import { Toaster } from '@joshicodes/cock';

	let { children } = $props();
<` +
		`/script>

{@render children()}

<Toaster position="bottom-right" />`;

	const usage =
		`<script lang="ts">
	import { Button, Card, CardContent, CardHeader, CardTitle, toast } from '@joshicodes/cock';
<` +
		`/script>

<Card class="max-w-sm">
	<CardHeader>
		<CardTitle>It works</CardTitle>
	</CardHeader>
	<CardContent>
		<Button onclick={() => toast.success('Hello')}>Say hello</Button>
	</CardContent>
</Card>`;

	const sources = `@import 'tailwindcss';
@source '../node_modules/@joshicodes/cock/dist';
@import '@joshicodes/cock/theme.css';`;

	let { data } = $props();

	const csp = (hash: string) => `Content-Security-Policy: script-src 'self' '${hash}'`;

	const nonce =
		`<!-- src/app.html, inside <head> -->
<script nonce="%sveltekit.nonce%">%cock.theme%<` + `/script>`;
</script>

<Seo
	title="Getting started with cock: Svelte 5 + Tailwind 4"
	path="/docs/getting-started"
	description="Install the cock component kit in a SvelteKit project: Tailwind 4 setup, the dark mode fix that avoids a flash of the wrong theme, and your first component."
/>

<Prose>
	<h1 class="text-3xl font-semibold tracking-tight text-fg">Getting started</h1>
	<p class="text-lg">
		Five minutes from an empty SvelteKit project to working components. You need Svelte 5 and
		Tailwind 4; everything else comes with the package.
	</p>

	<dl
		class="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3"
	>
		{#each data.requires as item (item.label)}
			<div class="bg-surface px-4 py-3">
				<dt class="text-sm text-fg-muted">{item.label}</dt>
				<dd class="mt-0.5 font-mono text-sm text-fg">{item.range}</dd>
			</div>
		{/each}
	</dl>
	<p class="mt-3 text-sm text-fg-subtle">
		Svelte and Tailwind are peer dependencies, so your project keeps control of the exact versions.
		The Node range only applies to the SvelteKit server; the components themselves run wherever
		Svelte does.
	</p>

	<h2 id="install">1. Install</h2>
	<p>
		The package is on the public npm registry. Its only runtime dependencies are
		<Code>clsx</Code> and <Code>tailwind-merge</Code>.
	</p>
	<div class="mt-5"><InstallTabs /></div>

	<h2 id="tailwind">2. Point Tailwind at the tokens</h2>
	<p>
		Add one import to the stylesheet that already pulls in Tailwind. It brings the design tokens,
		the <Code>dark</Code> variant, the base layer, and a <Code>@source</Code> directive so Tailwind sees
		the class names used inside the package.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={tailwind} label="src/app.css" />
	</div>
	<p>If your bundler does not resolve the package path, point Tailwind at the folder yourself:</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={sources} label="src/app.css" />
	</div>

	<h2 id="dark-mode">3. Fix the dark mode flash</h2>
	<p>
		Dark mode is a <Code>dark</Code> class on <Code>&lt;html&gt;</Code>, and the stored preference
		lives in local storage. A server cannot read local storage, so without help the page renders in
		the wrong scheme and corrects itself one frame later — the white flash every dark site starts
		out with.
	</p>
	<p>
		The kit ships a hook that writes the class before anything paints. One line, no changes to
		<Code>app.html</Code>:
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={hook} label="src/hooks.server.ts" />
	</div>
	<p>Already have a <Code>handle</Code>? Put it in a sequence:</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={sequence} label="src/hooks.server.ts" />
	</div>

	<h3>Somewhere other than SvelteKit</h3>
	<p>
		<Code>themeScript</Code> is the plain source and <Code>themeScriptTag</Code> is the same thing wrapped
		in a script tag. Inline either one in your template, as early in the head as you can manage. If you
		would rather control the position inside <Code>app.html</Code>, put a placeholder there and
		replace it yourself:
	</p>
	<div class="mt-5 grid gap-3">
		<div class="overflow-hidden rounded-lg border border-border">
			<CodeBlock code={manual} label="src/app.html" />
		</div>
		<div class="overflow-hidden rounded-lg border border-border">
			<CodeBlock code={manualHook} label="src/hooks.server.ts" />
		</div>
	</div>

	<Alert variant="info" title="It only matters for the first paint" class="mt-6">
		Everything else about the theme is reactive. The script exists purely so the very first frame is
		already correct.
	</Alert>

	<h3>If you send a Content-Security-Policy</h3>
	<p>
		The script is inline, so a policy without <Code>'unsafe-inline'</Code> drops it. Nothing breaks loudly
		— you get a console warning and the flash back. Allow it by its hash:
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={csp(data.scriptHash)} label="response header" />
	</div>
	<p>
		That hash is this version's script, printed from the package at build time. It changes when the
		script does, which is rare but does happen on an update, so re-read it here when you upgrade.
	</p>
	<p>
		A nonce works too, but only if you put the script in <Code>app.html</Code> yourself, because SvelteKit
		cannot nonce a tag a hook injected afterwards:
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={nonce} label="src/app.html" />
	</div>
	<p>
		With <Code>csp.mode: 'nonce'</Code> in <Code>svelte.config.js</Code>, SvelteKit fills the
		placeholder and adds the nonce to the header. The catch is that a nonce has to be new on every
		request, so a page carrying one cannot be prerendered — SvelteKit refuses the build with
		<em>cannot use prerendering if page template contains %sveltekit.nonce%</em>. On a prerendered
		site, use the hash.
	</p>

	<h2 id="toaster">4. Mount the toaster</h2>
	<p>
		Only needed if you want toasts. One instance in the root layout serves the whole app, and
		<Code>toast()</Code> works from anywhere, including outside components.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={layout} label="src/routes/+layout.svelte" />
	</div>

	<h2 id="use">5. Use it</h2>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={usage} label="src/routes/+page.svelte" />
	</div>

	<h2 id="editors">Editors</h2>
	<p>
		The package ships a <Code>.d.ts</Code> next to every component, so props, variants and their defaults
		complete themselves — as long as your editor speaks Svelte. In VS Code that is the official Svelte
		extension. In WebStorm and the other JetBrains IDEs it is the bundled Svelte plugin.
	</p>
	<p>
		If WebStorm marks the import as unresolved and offers nothing, it is usually the IDE reading the
		conditional <Code>exports</Code> map rather than anything in your project — see
		<a href="https://youtrack.jetbrains.com/issue/WEB-75046">WEB-75046</a>, fixed in the 2025.3.1
		builds. The package lists a plain <Code>default</Code> entry alongside the
		<Code>svelte</Code> one for that reason. On an older build, updating and then
		<em>File → Invalidate Caches</em> is the fix.
	</p>

	<h2 id="next">Where to go next</h2>
	<ul>
		<li>
			<a href="/docs/theming">Theming</a> — the three colors everything else is mixed from, and the runtime
			API.
		</li>
		<li>
			<a href="/components">Components</a> — every component with examples, props and keyboard behavior.
		</li>
		<li>
			<a href="/docs/utilities">Helpers and actions</a> — the exports that are not components:
			<Code>cn</Code>, hotkeys, confetti and the four actions.
		</li>
		<li>
			<a href="/docs/types">Types</a> — every exported type, written out in full.
		</li>
		<li>
			<a href="/themes">Theme generator</a> — roll a palette and copy the CSS.
		</li>
	</ul>

	<div class="mt-8 flex flex-wrap gap-3">
		<Button href="/docs/theming">Theming</Button>
		<Button variant="outline" href="/components">Browse components</Button>
	</div>
</Prose>
