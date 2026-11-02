<script lang="ts">
	import {
		accents,
		theme,
		Button,
		ColorPicker,
		Modal,
		Popover,
		Slider,
		Switch,
		ThemeToggle,
		cn,
		oklchToHex,
		parseColor
	} from '@joshicodes/cock';
	import CodeBlock from './CodeBlock.svelte';
	import { exportTheme } from './exportTheme.js';
	import { luminance, shift, tokenHex } from './color.js';

	// Swatches for the preset buttons; the tokens themselves only exist on :root.
	const swatch: Record<string, string> = {
		plum: 'oklch(0.52 0.18 316)',
		cobalt: 'oklch(0.55 0.19 256)',
		pine: 'oklch(0.56 0.15 158)',
		ember: 'oklch(0.6 0.19 35)',
		gold: 'oklch(0.76 0.16 84)',
		ink: 'oklch(0.3 0 0)'
	};

	const colors = [
		{ token: '--ck-bg', label: 'Background' },
		{ token: '--ck-fg', label: 'Text' },
		{ token: '--ck-accent', label: 'Accent' }
	];

	let hex = $derived.by(() => {
		if (typeof document === 'undefined') return {} as Record<string, string>;
		// The revision covers mode, accent and every token override.
		theme.revision;
		return Object.fromEntries(colors.map(({ token }) => [token, tokenHex(token)]));
	});

	let tint = $state(0);
	let radius = $state(1);
	let shadows = $state(true);

	$effect(() => {
		// Follow the stylesheet: light and dark have different defaults, and a
		// reset puts everything back.
		theme.revision;
		const style = getComputedStyle(document.documentElement);
		tint = parseFloat(style.getPropertyValue('--ck-tint')) || 0;
		radius = parseFloat(style.getPropertyValue('--ck-radius-scale')) || 1;
		shadows = style.getPropertyValue('--ck-shadow').trim() !== 'none';
	});

	function setColor(token: string, value: string) {
		theme.setToken(token, value);

		// An accent needs a hover shade and readable text on top. Neither is
		// worth deriving in CSS, so they are set alongside it.
		if (token === '--ck-accent') {
			const parsed = parseColor(value);
			if (!parsed) return;
			const hexValue = oklchToHex(parsed);
			const dark = theme.resolved === 'dark';
			theme.setToken('--ck-accent-hover', shift(hexValue, dark ? 8 : -10));
			theme.setToken('--ck-accent-fg', luminance(hexValue) > 0.42 ? '#17181b' : '#ffffff');
		}
	}

	function usePreset(name: string) {
		for (const token of ['--ck-accent', '--ck-accent-hover', '--ck-accent-fg']) {
			theme.clearToken(token);
		}
		theme.accent = name;
	}

	function setShadows(on: boolean) {
		shadows = on;
		for (const token of ['--ck-shadow-sm', '--ck-shadow', '--ck-shadow-lg']) {
			if (on) theme.clearToken(token);
			else theme.setSharedToken(token, 'none');
		}
	}

	function reset() {
		theme.clearTokens();
		theme.accent = 'plum';
	}

	let exporting = $state(false);
	let exported = $state('');

	function openExport() {
		exported = exportTheme();
		exporting = true;
	}

	let edited = $derived(Object.keys(theme.tokens).length > 0 || theme.accent !== 'plum');
</script>

<div class="flex flex-wrap items-start justify-between gap-4">
	<div>
		<h2 class="text-base font-semibold text-fg">Customize</h2>
		<p class="mt-0.5 text-sm text-fg-muted">
			Everything here is a CSS custom property, kept in local storage. Play with it as long as you
			like.
		</p>
	</div>
	<div class="flex items-center gap-2">
		<Button size="sm" variant="ghost" onclick={reset} disabled={!edited}>Reset all</Button>
		<Button size="sm" variant="outline" onclick={openExport}>Export CSS</Button>
	</div>
</div>

<div class="mt-6 grid gap-x-12 gap-y-6 md:grid-cols-2">
	<div class="space-y-6">
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="space-y-2">
				<p class="text-sm font-medium text-fg">Accent</p>
				<div class="flex flex-wrap gap-2">
					{#each accents as name (name)}
						<button
							type="button"
							onclick={() => usePreset(name)}
							title={name}
							aria-label="Use the {name} accent"
							aria-pressed={theme.accent === name}
							class={cn(
								'size-7 cursor-pointer rounded-full border border-black/10 ring-offset-surface transition-shadow',
								theme.accent === name && 'ring-2 ring-fg ring-offset-2'
							)}
							style:background={swatch[name]}
						></button>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-sm font-medium text-fg">Mode</p>
				<ThemeToggle variant="segmented" />
			</div>
		</div>

		<div class="grid gap-2 sm:grid-cols-3">
			{#each colors as field (field.token)}
				<Popover placement="bottom-start">
					{#snippet trigger(attrs)}
						<button
							type="button"
							{...attrs}
							aria-label="Change the {field.label.toLowerCase()} colour"
							class="flex w-full cursor-pointer items-center gap-3 rounded-md border border-border bg-bg p-2.5 text-left transition-colors hover:border-border-strong"
						>
							<span
								class="size-8 shrink-0 rounded-md border border-black/10"
								style:background={hex[field.token] ?? 'transparent'}
							></span>
							<span class="min-w-0">
								<span class="block text-sm text-fg">{field.label}</span>
								<span class="block text-xs text-fg-subtle tabular-nums">
									{hex[field.token] ?? ''}
								</span>
							</span>
						</button>
					{/snippet}

					<ColorPicker
						value={hex[field.token] ?? '#000000'}
						label={field.label}
						onchange={(value) => setColor(field.token, value)}
					/>
				</Popover>
			{/each}
		</div>
	</div>

	<div class="space-y-5">
		<Slider
			bind:value={tint}
			min={0}
			max={20}
			step={0.5}
			label="Accent in the background"
			showValue
			format={(value) => `${value}%`}
			onchange={(value) => theme.setToken('--ck-tint', `${value}%`)}
		/>

		<Slider
			bind:value={radius}
			min={0}
			max={2}
			step={0.05}
			label="Corner radius"
			showValue
			format={(value) => `${value.toFixed(2)}×`}
			onchange={(value) => theme.setSharedToken('--ck-radius-scale', String(value))}
		/>

		<Switch checked={shadows} onchange={setShadows}>Shadows</Switch>
	</div>
</div>

<Modal
	bind:open={exporting}
	title="Pull out your theme"
	description="Both schemes as they are on screen, presets and tweaks included. Paste it after the cock import in your global stylesheet. It travels well."
	size="lg"
>
	<div class="overflow-hidden rounded-lg border border-border">
		<CodeBlock code={exported} label="app.css" />
	</div>
</Modal>
