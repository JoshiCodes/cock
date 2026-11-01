<center>
  <img src="static/brand/logo.svg" alt="cock" height="40">
</center>

# Cock - COre Component Kit

**c**ore **c**omponent **k**it — the SvelteKit layer I start projects on.
63 components, one token file, two runtime dependencies (`clsx`, `tailwind-merge`).

Svelte 5 runes, Tailwind 4, TypeScript.

The preview site lives at [cock.joshicodes.de](https://cock.joshicodes.de).

**Note:** I am not good at frontend design. That's why I made this Kit. A lot of the design parts is created with Claude Code, but I did made changes.
I am very much commited to keep this Kit simple and easy to use, while also providing everything needed. If you want to fix some code or add something new, feel free to create an issue and/or pull request.

## Install

```bash
bun add @joshicodes/cock
```

Then import the tokens after Tailwind in your global stylesheet:

```css
@import 'tailwindcss';
@import '@joshicodes/cock/theme.css';
```

That one import brings the tokens, the `dark` variant, the base layer and a
`@source` directive so Tailwind sees the class names used inside the package.

```svelte
<script>
	import { Button, Card, CardHeader, CardTitle } from '@joshicodes/cock';
</script>

<Card>
	<CardHeader>
		<CardTitle>Hello</CardTitle>
	</CardHeader>
</Card>
```

### Dark mode without a flash

Dark mode is a `dark` class on `<html>` and the preference lives in local storage,
which a server cannot read. Without help the page renders in the wrong scheme and
corrects itself a frame later. The kit ships a hook that writes the class before
anything paints:

```js
// src/hooks.server.js
export { themeHandle as handle } from '@joshicodes/cock';
```

Already have a `handle`? Put it in `sequence(themeHandle, yourHandle)`. Outside
SvelteKit, inline the exported `themeScript` or `themeScriptTag` in your template.

### Toasts

Mount the container once in your root layout:

```svelte
<script>
	import { Toaster } from '@joshicodes/cock';
</script>

{@render children()}
<Toaster position="bottom-right" />
```

```js
import { toast } from '@joshicodes/cock';

toast('Saved');
toast.success('Deployed', { description: 'Build #1842 is live.' });
toast.error('Failed', { duration: 0, action: { label: 'Retry', onclick: retry } });
```

## Theming

Three colours are set by hand. Everything else is mixed from them with
`color-mix`, so changing the background re-skins the kit:

```css
:root {
	--ck-bg: oklch(0.985 0 0);
	--ck-fg: oklch(0.205 0 0);
	--ck-accent: oklch(0.58 0.19 32);
}
```

| Set by hand   | Mixed from them                                                |
| ------------- | -------------------------------------------------------------- |
| `--ck-bg`     | `--ck-surface` `--ck-muted` `--ck-border` `--ck-border-strong` |
| `--ck-fg`     | `--ck-fg-muted` `--ck-fg-subtle`                               |
| `--ck-accent` | `--ck-accent-soft` `--ck-ring`                                 |

Set `--ck-accent-hover` and `--ck-accent-fg` alongside a custom accent; contrast on
a coloured button is a judgement call, not something worth deriving.

Status colours (`--ck-success`, `--ck-warning`, `--ck-danger`, `--ck-info`) and the
mix ratios (`--ck-mix-border`, `--ck-mix-fg-muted`, …) are separate knobs. Each token
is exposed to Tailwind as a colour utility: `bg-surface`, `text-fg-muted`,
`border-border`, `bg-accent/12`.

Radius and shadow use Tailwind's own scales, so you re-tune them the normal way:

```css
@theme {
	--radius-lg: 0.25rem; /* squarer controls everywhere */
}
```

### Accents and runtime overrides

Six presets: `plum` (default), `cobalt`, `pine`, `ember`, `gold`, `ink`. Set
`data-accent` on `<html>`, or go through the `theme` object:

```js
import { theme } from '@joshicodes/cock';

theme.accent = 'pine';
theme.mode = 'dark'; // 'light' | 'dark' | 'system'
theme.toggle();

theme.setToken('--ck-bg', '#f6f5f2'); // the scheme on screen
theme.setToken('--ck-bg', '#101014', 'dark'); // or a specific one
theme.setTokens({ light: { … }, dark: { … } }); // replace all overrides
theme.clearTokens(); // back to the stylesheet
```

`setSharedToken` writes to both schemes, for things like radius that are not a
colour. The Customize panel on the preview page has an **Export CSS** button that writes out
both schemes as they are on screen — presets resolved, tweaks included — ready to
paste after the cock import.

Overrides persist to local storage, and the page crossfades rather than
snapping when the theme changes. The control panel on the preview page is wired to
exactly these calls.

### Themes on part of a page

Put `data-ck-theme="light"` or `"dark"` on any element and that subtree gets its own
theme: set `--ck-*` variables on it and the surfaces, borders and text colours are
recomputed from them there. The element paints its own background.

```svelte
<section data-ck-theme="dark" style="--ck-accent: oklch(0.75 0.15 160)">
	<Card>…</Card>
</section>
```

The theme generator on the preview page uses this to show light and dark side by side.
Overlays (`Modal`, `Drawer`, `DropdownMenu`, `Popover`, `Tooltip`) render into `<body>`,
so they follow the page theme, not the subtree's.

## Components

| Group          | Components                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Primitives** | `Button` `CopyButton` `Badge` `Avatar` `Kbd` `Code` `Spinner` `Skeleton` `Separator` `ThemeToggle`                  |
| **Layout**     | `Card` + `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter`, `EmptyState`                        |
| **Forms**      | `Field` `Label` `Input` `Textarea` `Select` `Checkbox` `Radio` `RadioGroup` `Switch` `Slider` `PinInput` `TagInput` |
| **Feedback**   | `Alert` `Progress` `ProgressRing` `Tooltip` `Toaster` and the `toast` helper                                        |
| **Overlays**   | `CommandPalette` `Modal` `Drawer` `Popover` `DropdownMenu` + `MenuItem` `MenuLabel` `MenuSeparator`                 |
| **Navigation** | `Tabs` `TabList` `Tab` `TabPanel`, `Accordion` `AccordionItem`, `Breadcrumb` `Pagination`                           |
| **Data**       | `Table` `Stat` `Sparkline` `Heatmap`                                                                                |
| **Effects**    | `Typewriter` `Caret` `Scramble` `CountUp` `Marquee` `Reveal` `Highlight` `Terminal` `Odometer`                      |

`bun run dev` shows all of them with live examples and copyable snippets.

### Tables

`Table` styles plain `thead`/`tbody` markup. `tone="accent"` carries the theme colour
into the header, stripes and hover; `<tr aria-selected="true">` marks a selected row
in either tone. `striped`, `dense` and `hoverable` do what they say.

### Cards

Cards are flat by default: a border, no shadow. `variant="elevated"` adds one,
`variant="raised"` lifts on hover (good for cards that are links), and `variant="flat"`
drops the border for a filled box.

### Command palette

```svelte
<script>
	import { CommandPalette } from '@joshicodes/cock';

	const commands = [
		{ id: 'new', label: 'New project', group: 'Projects', onselect: create },
		{ id: 'theme', label: 'Toggle dark mode', keywords: ['light'], onselect: theme.toggle }
	];
</script>

<CommandPalette {commands} />
```

Opens with ⌘K on Apple devices and Ctrl+K elsewhere (`shortcut` changes it, `false` turns
it off). Search is fuzzy over labels and keywords, results keep their groups, and the
arrow keys and Enter work as in any combobox. The same shortcut handling is exported:
`onHotkey('mod+s', save)` returns its own cleanup, and `formatHotkey('mod+k')` gives
`⌘K` or `Ctrl+K` for labels.

### Effects

```svelte
<h1>Components for <Typewriter text={['forms', 'dialogs', 'menus']} reserve /></h1>

<span>bun run dev<Caret /></span>
<Scramble text={status} trigger="visible" />
<CountUp value={12840} />
<Marquee speed={40}>
	{#each logos as logo}<img src={logo} alt="" />{/each}
</Marquee>
<Reveal delay={120}><Card>…</Card></Reveal>
<p>Ship the <Highlight>boring parts</Highlight> first.</p>
```

```js
import { confetti } from '@joshicodes/cock';

confetti({ origin: button }); // an element, a point, or nothing for the middle
```

`Typewriter` types once for a single string and cycles for an array; `reserve` holds the
width of the longest string so the surrounding text does not jump. `Caret` is the
blinking bar on its own. All effects render the final text when the visitor prefers
reduced motion, give screen readers the full text, and show the plain content before
JavaScript runs.

Also exported: the `portal`, `clickOutside`, `trapFocus` and `anchored` actions, the
`cn`, `uid`, `lockScroll`, `confetti`, `onHotkey` and `formatHotkey` helpers, and the shared style fragments (`focusRing`,
`focusRingInset`, `disabled`, `transition`) that keep components
consistent when you write your own.

## Extending

Every component takes a `class` prop merged through `tailwind-merge`, so your
utility wins instead of fighting the default:

```svelte
<Button class="rounded-full px-8">Pill</Button>
<Card class="border-accent/40">Tinted</Card>
```

For a variant you use often, wrap it:

```svelte
<!-- DangerButton.svelte -->
<script>
	import { Button, cn } from '@joshicodes/cock';
	let { class: className, ...rest } = $props();
</script>

<Button variant="danger" class={cn('tracking-wide uppercase', className)} {...rest} />
```

`Tabs`, `Accordion`, `RadioGroup` and `DropdownMenu` talk to their children through
context, so you can put your own markup in between without breaking the wiring.

Overlays position themselves with a fixed-position panel portalled to `<body>`, so
an `overflow: hidden` ancestor or a scrolling table never clips them.

## Running the preview site

The site builds with `@sveltejs/adapter-node` and prerenders every page it can,
so search engines get finished HTML. The Dockerfile builds it with Bun and runs it
on Node, as an unprivileged user, on plain HTTP port 3000. TLS and the domain are
left to the reverse proxy in front of it.

```bash
docker compose up -d --build
```

That binds the container to `127.0.0.1:3000` only. Point the proxy there, and keep
`ORIGIN` in `docker-compose.yml` set to the public URL.

SEO lives in `src/routes/seo.ts` (URL, title, description) and
`src/routes/showcase/Seo.svelte` (meta tags, Open Graph, JSON-LD). `robots.txt` and
`sitemap.xml` are prerendered routes; the social preview image is `static/og.png`.
