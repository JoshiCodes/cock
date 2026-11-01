<script lang="ts">
	import { Alert, Button, Code, Kbd, confetti, formatHotkey, onHotkey } from '@joshicodes/cock';
	import CodeBlock from '../../showcase/CodeBlock.svelte';
	import Prose from '../../showcase/Prose.svelte';
	import Seo from '../../showcase/Seo.svelte';

	const classes = `import { cn } from '@joshicodes/cock';

// Later Tailwind utilities win, so a caller's class beats the default.
cn('px-3 py-2 text-sm', props.class);
cn('rounded-md', isActive && 'bg-accent text-accent-fg');`;

	const ids = `const id = uid();            // ck-1f
const id = uid('field');     // field-1g

<label for={id}>Email</label>
<input {id} aria-describedby="{id}-hint" />`;

	const scroll = `const release = lockScroll();
// …while the overlay is open
release();`;

	const hotkeys = `const off = onHotkey('mod+k', () => (open = true));
onDestroy(off);

formatHotkey('mod+k');   // ⌘K on Apple devices, Ctrl+K elsewhere
matchesHotkey(event, 'shift+/');`;

	const actions = `<div use:portal>…</div>                     <!-- moved to <body> -->
<div use:portal={'#overlays'}>…</div>

<div use:clickOutside={() => (open = false)}>…</div>
<div use:clickOutside={{ handler: close, ignore: [trigger] }}>…</div>

<div use:trapFocus>…</div>

<div use:anchored={{ to: trigger, placement: 'bottom-start', offset: 8 }}>…</div>`;

	const fragments = `import { cn, focusRing, transition, disabled } from '@joshicodes/cock';

<button class={cn('rounded-md px-3 py-2', focusRing, transition, disabled)}>`;

	const burst = `confetti();                                   // from the middle of the screen
confetti({ origin: button });                 // from an element
confetti({ origin: { x: 100, y: 400 } });     // from a point

confetti({
	count: 220,
	angle: -70,
	spread: 50,
	velocity: 16,
	gravity: 0.8,
	scale: 1.4,
	colors: ['#f0b429', '#e8590c'],
	duration: 3200
});`;

	// The same shortcut the command palette uses, written for this platform.
	let shortcut = $state('Ctrl+K');
	$effect(() => {
		shortcut = formatHotkey('mod+k');
	});

	$effect(() => onHotkey('mod+shift+c', () => confetti({ count: 60 })));
</script>

<Seo
	title="Helpers, actions and confetti in Svelte"
	path="/docs/utilities"
	description="The parts of the cock component kit that are not components: cn, uid, lockScroll, confetti, hotkey helpers and the portal, clickOutside, trapFocus and anchored actions."
/>

<Prose>
	<h1 class="text-3xl font-semibold tracking-tight text-fg">Helpers and actions</h1>
	<p class="text-lg">
		Not everything in the package is a component. These are the functions and actions the components
		use on each other, exported because they are just as useful in your own code.
	</p>
	<p>
		Every type mentioned here is written out on the <a href="/docs/types">types page</a>.
	</p>

	<h2 id="cn">cn</h2>
	<p>
		Merges class names through <Code>clsx</Code> and <Code>tailwind-merge</Code>. The second half is
		the important one: <Code>cn('px-2', 'px-8')</Code> gives you <Code>px-8</Code> rather than two fighting
		utilities. Every component runs its <Code>class</Code> prop through this, which is why passing a class
		always wins.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={classes} label="cn" />
	</div>

	<h2 id="uid">uid</h2>
	<p>
		A counter, not a UUID. It exists for wiring <Code>aria-describedby</Code> and
		<Code>for</Code> attributes together when a component renders several elements that have to refer
		to each other.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={ids} label="uid" />
	</div>
	<p>
		Ids are per page load, so do not put one in a database or a URL. In a server-rendered page the
		counter starts again on the client; the components only use ids for attributes that are set on
		the same render, where that does not matter.
	</p>

	<h2 id="lock-scroll">lockScroll</h2>
	<p>
		Freezes the page behind an overlay and pads the body by the scrollbar width, so the layout does
		not jump sideways. Reference counted: two open overlays take two locks, and scrolling comes back
		when the last one lets go.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={scroll} label="lockScroll" />
	</div>

	<h2 id="confetti">confetti</h2>
	<p>
		A canvas burst, drawn in the theme's accent and status colours unless you pass your own. It
		returns a promise that resolves when the last piece has faded, and it does nothing at all when
		the visitor has reduced motion turned on — so you can call it without a guard.
	</p>

	<div class="mt-5 flex flex-wrap gap-3 rounded-lg border border-border bg-surface p-5">
		<Button onclick={(event) => confetti({ origin: event.currentTarget as HTMLElement })}>
			From this button
		</Button>
		<Button
			variant="outline"
			onclick={() =>
				confetti({ count: 60, angle: -60, spread: 35, velocity: 15, gravity: 1.4, scale: 0.7 })}
		>
			Smaller, sideways, heavier
		</Button>
		<Button variant="ghost" onclick={() => confetti({ count: 300, spread: 160, duration: 4000 })}>
			Far too much
		</Button>
	</div>
	<p class="!mt-3 text-sm text-fg-subtle">
		Or press <Kbd>{formatHotkey('mod+shift+c')}</Kbd>, which is wired up further down this page with
		<Code>onHotkey</Code>.
	</p>

	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={burst} label="confetti" />
	</div>
	<p>
		<a href="/docs/types#ConfettiOptions">ConfettiOptions</a> has the full list.
		<Code>angle</Code> is the middle of the cone in degrees, where <Code>-90</Code> is straight up and
		<Code>0</Code> is to the right; <Code>gravity</Code> and <Code>scale</Code> are multipliers on the
		defaults, so <Code>0.5</Code> is half as heavy and half as big.
	</p>

	<h2 id="hotkeys">onHotkey, matchesHotkey, formatHotkey</h2>
	<p>
		Shortcuts written as strings: <Code>mod+k</Code>, <Code>shift+/</Code>,
		<Code>alt+enter</Code>. <Code>mod</Code> is ⌘ on Apple devices and Ctrl everywhere else, which is
		the part everybody gets wrong. <Code>onHotkey</Code> listens on the window and returns its own cleanup;
		<Code>formatHotkey</Code> gives you the label to print, like the <Kbd>{shortcut}</Kbd> on the
		<a href="/components/command-palette">command palette</a>.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={hotkeys} label="hotkeys" />
	</div>

	<h2 id="actions">Actions</h2>
	<p>
		Four Svelte actions, used by the overlays and exported for your own. <Code>portal</Code> moves a node
		to <Code>&lt;body&gt;</Code> so no ancestor can clip it, <Code>clickOutside</Code> closes things,
		<Code>trapFocus</Code> keeps Tab inside a dialog and hands focus back on destroy, and
		<Code>anchored</Code> positions a panel against a trigger and flips it when the viewport runs out.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={actions} label="actions" />
	</div>
	<Alert variant="info" title="trapFocus needs something to focus" class="mt-6">
		An empty container has nothing to trap, so Tab leaves it. The overlays always render a close
		button for exactly this reason.
	</Alert>

	<h2 id="style-fragments">Style fragments</h2>
	<p>
		Four strings of Tailwind utilities — <Code>focusRing</Code>, <Code>focusRingInset</Code>,
		<Code>disabled</Code> and <Code>transition</Code> — that every component in the kit uses. Reach for
		them when you write a control of your own and want it to ring and fade like the rest.
	</p>
	<div class="mt-5 overflow-hidden rounded-lg border border-border">
		<CodeBlock code={fragments} label="style fragments" />
	</div>

	<h2 id="elsewhere">Documented elsewhere</h2>
	<ul>
		<li>
			<Code>theme</Code> and <Code>accents</Code> — the runtime theme object, on
			<a href="/docs/theming">theming</a>.
		</li>
		<li>
			<Code>toast</Code> and <Code>toasts</Code> — on
			<a href="/components/toaster">Toaster</a>.
		</li>
		<li>
			<Code>themeScript</Code>, <Code>themeScriptTag</Code> and <Code>themeHandle</Code> — the no-flash
			script, in
			<a href="/docs/getting-started">getting started</a>.
		</li>
	</ul>
</Prose>
