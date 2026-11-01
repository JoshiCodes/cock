<script lang="ts">
	import { page } from '$app/state';
	import { replaceState } from '$app/navigation';
	import { Alert, Button, Kbd, Switch, Table, theme as site, toast, cn } from '@joshicodes/cock';
	import CodeBlock from '../showcase/CodeBlock.svelte';
	import Seo from '../showcase/Seo.svelte';
	import ThemePreview from './ThemePreview.svelte';
	import { audit, passesAA } from './contrast.js';
	import {
		decode,
		encode,
		generate,
		stylesheet,
		toHex,
		tokens,
		type Locks,
		type Theme
	} from './generate.js';

	let theme = $state<Theme>(decode(page.url.searchParams.get('t') ?? '') ?? generate());
	let locks = $state<Locks>({ accent: false, background: false, shape: false });
	let history = $state<Theme[]>([]);
	let accessibleOnly = $state(false);

	// Re-measured whenever the theme changes; the audit reads painted colours.
	let reports = $derived([
		{ scheme: 'light' as const, report: audit(theme, 'light') },
		{ scheme: 'dark' as const, report: audit(theme, 'dark') }
	]);
	let failing = $derived(reports.flatMap((entry) => entry.report.checks.filter((c) => !c.passes)));
	let fading = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	const lockLabels: { key: keyof Locks; label: string }[] = [
		{ key: 'accent', label: 'Accent' },
		{ key: 'background', label: 'Background' },
		{ key: 'shape', label: 'Corners' }
	];

	function show(next: Theme) {
		theme = next;
		fading = true;
		clearTimeout(timer);
		timer = setTimeout(() => (fading = false), 340);
	}

	function roll() {
		history = [theme, ...history].slice(0, 12);

		let next = generate(theme, locks);
		if (accessibleOnly) {
			// Rerolling is cheap; after this many tries the locks are probably
			// what is making it impossible, so keep the last one and say so.
			for (let tries = 0; tries < 40 && !passesAA(next); tries++) {
				next = generate(theme, locks);
			}
		}
		show(next);
	}

	function restore(index: number) {
		const previous = history[index];
		history = [theme, ...history.filter((_, i) => i !== index)].slice(0, 12);
		show(previous);
	}

	function apply() {
		site.setTokens({
			light: tokens(theme.light, theme.radius),
			dark: tokens(theme.dark, theme.radius)
		});
		toast.success(`${theme.name} applied to the site`, {
			description: 'Looks good on you. Reset it any time from the Customize panel.'
		});
	}

	async function copyLink() {
		await navigator.clipboard.writeText(location.href);
		toast('Link copied', { description: 'Anyone who opens it gets exactly what you had.' });
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.code !== 'Space' || event.repeat) return;
		const target = event.target as HTMLElement;
		if (target.closest('input, textarea, select, button, a, [contenteditable]')) return;
		event.preventDefault();
		roll();
	}

	// Keep the URL in step so the theme can be shared or reloaded.
	$effect(() => {
		replaceState(`?t=${encode(theme)}`, {});
	});

	let css = $derived(stylesheet(theme));
</script>

<svelte:window {onkeydown} />

<Seo
	title="Theme generator"
	path="/themes"
	description="Generate light and dark themes for cock in OKLCH, preview them on real components and copy the CSS. Every theme comes in both schemes."
/>

{#snippet lockIcon(locked: boolean)}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" stroke-width="1.75" />
		<path
			d={locked ? 'M8 11V8a4 4 0 0 1 8 0v3' : 'M8 11V8a4 4 0 0 1 7.5-2'}
			stroke="currentColor"
			stroke-width="1.75"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

{#snippet swatches(subject: Theme, size: string)}
	<span class="flex -space-x-1">
		{#each [subject.light.bg, subject.dark.bg, subject.light.accent] as color, index (index)}
			<span class={cn('rounded-full ring-2 ring-bg', size)} style:background={toHex(color)}></span>
		{/each}
	</span>
{/snippet}

<div class="mx-auto max-w-7xl px-5 py-14 lg:px-8">
	<header class="flex flex-wrap items-end justify-between gap-8">
		<div>
			<h1 class="text-4xl font-semibold tracking-tight text-fg">Theme generator</h1>
			<p class="mt-3 max-w-xl text-lg leading-relaxed text-fg-muted">
				Roll until something fits. Lock the parts you like and the rest keeps changing. Every theme
				comes in light and dark. Nobody gets it right on the first try.
			</p>
		</div>

		<div class="flex items-center gap-3">
			<span class="hidden text-sm text-fg-subtle sm:inline">
				or press <Kbd>Space</Kbd>, repeatedly
			</span>
			<Button size="lg" onclick={roll}>Generate</Button>
		</div>
	</header>

	<div
		class="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-border py-4"
	>
		<div class="flex items-center gap-3">
			{@render swatches(theme, 'size-6')}
			<p class="text-lg font-semibold tracking-tight text-fg">{theme.name}</p>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<span class="mr-1 text-sm text-fg-muted">Hold on to</span>
			{#each lockLabels as lock (lock.key)}
				<Button
					size="sm"
					variant={locks[lock.key] ? 'soft' : 'outline'}
					aria-pressed={locks[lock.key]}
					onclick={() => (locks[lock.key] = !locks[lock.key])}
				>
					{@render lockIcon(locks[lock.key])}
					{lock.label}
				</Button>
			{/each}
		</div>
	</div>

	<div class="mt-5 flex flex-wrap items-center justify-between gap-4">
		<Switch bind:checked={accessibleOnly} description="Rerolls until every contrast check passes.">
			Only accessible themes
		</Switch>

		<p class="text-sm {failing.length ? 'text-warning' : 'text-success'}">
			{failing.length === 0
				? 'Passes WCAG AA in both schemes'
				: `${failing.length} contrast ${failing.length === 1 ? 'check falls' : 'checks fall'} short of AA`}
		</p>
	</div>

	<div class={cn('mt-6 grid gap-6 lg:grid-cols-2', fading && 'ck-theming')}>
		{#each ['light', 'dark'] as const as scheme (scheme)}
			<figure>
				<figcaption class="mb-2.5 text-sm text-fg-muted capitalize">{scheme}</figcaption>
				<div class="overflow-hidden rounded-xl border border-border">
					<ThemePreview {theme} {scheme} />
				</div>
			</figure>
		{/each}
	</div>

	{#if history.length > 0}
		<div class="mt-8 flex flex-wrap items-center gap-2">
			<span class="mr-1 text-sm text-fg-muted">Exes</span>
			{#each history as previous, index (index)}
				<button
					type="button"
					onclick={() => restore(index)}
					title={previous.name}
					class="flex cursor-pointer items-center gap-2 rounded-full border border-border py-1 pr-3 pl-1.5 text-xs transition-colors hover:border-border-strong"
				>
					{@render swatches(previous, 'size-4')}
					<span class="text-fg-muted">{previous.name}</span>
				</button>
			{/each}
		</div>
	{/if}

	<section class="mt-16">
		<h2 class="text-2xl font-semibold tracking-tight text-fg">Contrast</h2>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
			Measured on the colours the browser actually paints, including the ones mixed with color-mix.
			WCAG AA asks for 4.5:1 on text and 3:1 on borders and controls.
		</p>

		<div class="mt-5 grid gap-5 lg:grid-cols-2">
			{#each reports as entry (entry.scheme)}
				<div class="space-y-2">
					<p class="text-sm font-medium text-fg capitalize">
						{entry.scheme}
						<span class="ml-1 font-normal text-fg-muted">
							{entry.report.passed} of {entry.report.checks.length} pass
						</span>
					</p>

					<Table dense>
						<thead>
							<tr>
								<th>Check</th>
								<th class="text-right">Ratio</th>
								<th class="w-16 text-right">Needs</th>
							</tr>
						</thead>
						<tbody>
							{#each entry.report.checks as check (check.label)}
								<tr>
									<td>
										<span class={check.passes ? 'text-fg' : 'text-warning'}>{check.label}</span>
										<p class="mt-0.5 text-xs text-fg-subtle">{check.hint}</p>
									</td>
									<td
										class="text-right tabular-nums {check.passes
											? 'text-fg-muted'
											: 'text-warning'}"
									>
										{check.ratio.toFixed(2)}
									</td>
									<td class="text-right text-fg-subtle tabular-nums">{check.required}</td>
								</tr>
							{/each}
						</tbody>
					</Table>
				</div>
			{/each}
		</div>

		{#if failing.length}
			<Alert variant="warning" title="Worth a second look" class="mt-5">
				Placeholder text failing at 4.5:1 is common and often acceptable, since it repeats the
				label. A failing body text or button label is not — turn on "only accessible themes" and
				roll again.
			</Alert>
		{/if}
	</section>

	<section class="mt-16">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Take it home</h2>
				<p class="mt-2 text-[0.9375rem] text-fg-muted">
					Paste this into your global stylesheet, after the cock import. Everything else is derived
					from these lines. No strings attached.
				</p>
			</div>
			<div class="flex gap-2">
				<Button variant="outline" onclick={copyLink}>Copy link</Button>
				<Button variant="soft" onclick={apply}>Try it on</Button>
			</div>
		</div>

		<div class="mt-5 overflow-hidden rounded-lg border border-border">
			<CodeBlock code={css} label="app.css" />
		</div>
	</section>
</div>
