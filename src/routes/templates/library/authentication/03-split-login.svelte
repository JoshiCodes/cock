<!-- A two-column sign-in: the form on one side, a brand story and a customer quote in your accent on the other. -->
<script lang="ts" module>
	export const meta = {
		height: 600,
		options: [
			{ name: 'showQuote', label: 'Customer quote', type: 'boolean', default: true },
			{
				name: 'side',
				label: 'Brand side',
				type: 'select',
				default: 'left',
				options: [
					{ value: 'left', label: 'Left' },
					{ value: 'right', label: 'Right' }
				]
			},
			{ name: 'brand', label: 'Brand', type: 'text', default: 'northstar', placeholder: 'Brand' }
		]
	};
</script>

<script lang="ts">
	import { Avatar, Button, Field, Input, Link, Separator } from '@joshicodes/cock';

	let {
		showQuote = true,
		side = 'left',
		brand = 'northstar'
	}: { showQuote?: boolean; side?: 'left' | 'right'; brand?: string } = $props();
</script>

<div class="@container bg-bg">
	<div class="grid min-h-[37rem] @3xl:grid-cols-2">
		<aside
			class="flex flex-col justify-between gap-16 bg-accent p-8 text-accent-fg @3xl:p-12 {side ===
			'right'
				? '@3xl:order-last'
				: ''}"
		>
			<p class="text-lg font-semibold tracking-tight">{brand}</p>

			<div class="max-w-md">
				<h2 class="text-4xl leading-[1.1] font-semibold tracking-tight text-balance">
					Plan the quarter on one page.
				</h2>
				{#if showQuote}
					<figure class="mt-10">
						<blockquote class="text-lg leading-relaxed">
							“We stopped losing decisions in chat threads. Everything we agreed on is just there.”
						</blockquote>
						<figcaption class="mt-5 flex items-center gap-3">
							<Avatar name="Maya Chen" size="sm" class="ring-2 ring-accent-fg/30" />
							<span class="text-sm">
								<span class="block font-medium">Maya Chen</span>
								<span class="opacity-75">Head of product, Tidewater</span>
							</span>
						</figcaption>
					</figure>
				{/if}
			</div>
		</aside>

		<div class="flex items-center justify-center px-6 py-12 @3xl:px-12">
			<div class="w-full max-w-sm">
				<h1 class="text-2xl font-semibold tracking-tight text-fg">Welcome back</h1>
				<p class="mt-2 text-sm text-fg-muted">Sign in to your {brand} workspace.</p>

				<form class="mt-8 space-y-4" onsubmit={(event) => event.preventDefault()}>
					<Field label="Email">
						{#snippet children(field)}
							<Input
								{...field}
								type="email"
								autocomplete="email"
								placeholder="name@company.com"
								required
							/>
						{/snippet}
					</Field>
					<Field label="Password">
						{#snippet children(field)}
							<Input {...field} type="password" autocomplete="current-password" required />
						{/snippet}
					</Field>
					<div class="flex justify-end">
						<Link href="/" variant="muted" underline="hover" class="text-sm">Forgot password?</Link>
					</div>
					<Button type="submit" block>Sign in</Button>
				</form>

				<Separator class="my-6">or</Separator>
				<Button variant="outline" block>Sign in with SSO</Button>

				<p class="mt-8 text-center text-sm text-fg-muted">
					No account yet? <Link href="/">Start a free trial</Link>
				</p>
			</div>
		</div>
	</div>
</div>
