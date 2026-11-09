<!-- A full-page sign-in on graph paper. Crop marks frame the card, and the dots around the pointer swell into your accent. -->
<script lang="ts" module>
	export const meta = {
		height: 680,
		thumbnail: { motion: 'none' },
		options: [
			{
				name: 'pattern',
				label: 'Pattern',
				type: 'select',
				default: 'dots',
				options: [
					{ value: 'dots', label: 'Dots' },
					{ value: 'lines', label: 'Lines' }
				]
			},
			{
				name: 'motion',
				label: 'Motion',
				type: 'select',
				default: 'lift',
				options: [
					{ value: 'none', label: 'Still' },
					{ value: 'lift', label: 'Lift' },
					{ value: 'spotlight', label: 'Spotlight' },
					{ value: 'pan', label: 'Drift' }
				]
			},
			{ name: 'passkey', label: 'Passkey button', type: 'boolean', default: true },
			{ name: 'brand', label: 'Brand', type: 'text', default: 'fieldnote', placeholder: 'Brand' }
		]
	};
</script>

<script lang="ts">
	import {
		Button,
		Card,
		Checkbox,
		Field,
		GridBackground,
		Input,
		Link,
		Separator
	} from '@joshicodes/cock';

	let {
		pattern = 'dots',
		motion = 'lift',
		passkey = true,
		brand = 'fieldnote'
	}: {
		pattern?: 'lines' | 'dots';
		motion?: 'none' | 'spotlight' | 'pan' | 'lift';
		passkey?: boolean;
		brand?: string;
	} = $props();

	let reveal = $state(false);
</script>

<GridBackground
	variant={pattern}
	size={pattern === 'dots' ? 28 : 40}
	major={pattern === 'lines' ? 4 : undefined}
	fade="edges"
	animation={motion}
	direction="up"
	speed={8}
	radius={200}
	class="flex min-h-[42rem] flex-col bg-bg"
>
	<header class="flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
		<Link
			href="/"
			variant="inherit"
			underline="hover"
			class="flex items-center gap-2 font-semibold"
		>
			<svg viewBox="0 0 20 20" class="size-5 text-accent" aria-hidden="true">
				<path d="M2 2h7v7H2zM11 11h7v7h-7z" fill="currentColor" />
				<path d="M11 2h7v7h-7zM2 11h7v7H2z" fill="none" stroke="currentColor" stroke-width="1.5" />
			</svg>
			{brand}
		</Link>
		<p class="text-sm text-fg-muted">
			New here? <Link href="/">Create an account</Link>
		</p>
	</header>

	<main class="flex flex-1 items-center justify-center px-5 py-10">
		<div class="relative w-full max-w-[400px]">
			<!-- Crop marks, one per corner, just outside the card. -->
			<span
				aria-hidden="true"
				class="absolute -top-2 -left-2 size-4 border-t-2 border-l-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -top-2 -right-2 size-4 border-t-2 border-r-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -bottom-2 -left-2 size-4 border-b-2 border-l-2 border-accent"
			></span>
			<span
				aria-hidden="true"
				class="absolute -right-2 -bottom-2 size-4 border-r-2 border-b-2 border-accent"
			></span>

			<Card padding="lg" class="rounded-none">
				<h1 class="text-2xl font-semibold tracking-tight text-fg">Sign in to {brand}</h1>
				<p class="mt-1.5 text-sm text-fg-muted">Pick up exactly where you left off.</p>

				<form class="mt-7 space-y-4" onsubmit={(event) => event.preventDefault()}>
					<Field label="Email">
						{#snippet children(field)}
							<Input
								{...field}
								type="email"
								autocomplete="email"
								placeholder="you@company.com"
								required
							/>
						{/snippet}
					</Field>

					<Field label="Password">
						{#snippet children(field)}
							<Input
								{...field}
								type={reveal ? 'text' : 'password'}
								autocomplete="current-password"
								required
							>
								{#snippet trailing()}
									<Button
										variant="link"
										size="sm"
										onclick={() => (reveal = !reveal)}
										aria-pressed={reveal}
										class="text-xs"
									>
										{reveal ? 'Hide' : 'Show'}
									</Button>
								{/snippet}
							</Input>
						{/snippet}
					</Field>

					<div class="flex items-center justify-between gap-3 pt-1">
						<Checkbox>Keep me signed in</Checkbox>
						<Link href="/" variant="muted" underline="hover" class="text-sm">Forgot it?</Link>
					</div>

					<Button type="submit" block>Sign in</Button>
				</form>

				{#if passkey}
					<Separator class="my-6">or</Separator>
					<Button variant="outline" block>Use a passkey</Button>
				{/if}
			</Card>
		</div>
	</main>

	<footer
		class="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 px-6 pb-6 text-xs text-fg-subtle"
	>
		<span>© {new Date().getFullYear()} {brand}</span>
		<Link href="/" variant="muted" underline="hover">Terms</Link>
		<Link href="/" variant="muted" underline="hover">Privacy</Link>
		<Link href="/" variant="muted" underline="hover">Status</Link>
	</footer>
</GridBackground>
