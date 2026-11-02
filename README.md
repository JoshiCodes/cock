<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cock.joshicodes.de/brand/logo-dark.svg">
    <img src="https://cock.joshicodes.de/brand/logo.svg" alt="cock" height="36">
  </picture>
</p>

<p align="center">
  <strong>CO</strong>re <strong>C</strong>omponent <strong>K</strong>it — the SvelteKit layer I start projects on.
</p>

<p align="center">
  <a href="https://cock.joshicodes.de">Docs and live examples</a> ·
  <a href="https://cock.joshicodes.de/components">Components</a> ·
  <a href="https://cock.joshicodes.de/themes">Theme generator</a>
</p>

<p align="center">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/%40joshicodes%2Fcock">
    <img alt="NPM Last Update" src="https://img.shields.io/npm/last-update/%40joshicodes%2Fcock">

</p>

---

69 components for Svelte 5 and Tailwind 4, written in TypeScript. Forms, dialogs,
menus, tables and a few effects, with the keyboard handling and dark mode already
done. Two runtime dependencies: `clsx` and `tailwind-merge`.

```bash
bun add @joshicodes/cock
```

Import the tokens after Tailwind in your global stylesheet:

```css
@import 'tailwindcss';
@import '@joshicodes/cock/theme.css';
```

```svelte
<script>
	import { Button, Card, CardHeader, CardTitle } from '@joshicodes/cock';
</script>

<Card>
	<CardHeader>
		<CardTitle>Hello</CardTitle>
	</CardHeader>
	<Button>Click</Button>
</Card>
```

Three colours are set by hand, everything else is mixed from them with `color-mix`:

```css
:root {
	--ck-bg: oklch(0.985 0 0);
	--ck-fg: oklch(0.205 0 0);
	--ck-accent: oklch(0.58 0.19 32);
}
```

Everything else — every component with live examples, props tables, theming, the
dark-mode hook and the generator — is on
**[cock.joshicodes.de](https://cock.joshicodes.de)**.

## A note

I am not good at frontend design. That is why I made this kit. A lot of the design
work was done with Claude Code, but I went over it myself. I intend to keep the kit
simple and easy to use while still shipping what a project needs. If you want to fix
something or add something new, open an issue or a pull request —
[CONTRIBUTING.md](https://github.com/JoshiCodes/cock/blob/master/CONTRIBUTING.md)
says how the repo fits together.

MIT © [JoshiCodes](https://github.com/JoshiCodes)
