<!-- Passwordless sign-in: one field, then a calm "check your inbox" step with a resend timer. -->
<script lang="ts" module>
	export const meta = {
		height: 560,
		options: [
			{ name: 'sent', label: 'Show sent state', type: 'boolean', default: false },
			{ name: 'brand', label: 'Brand', type: 'text', default: 'Quillwork', placeholder: 'Brand' }
		]
	};
</script>

<script lang="ts">
	import { Button, Field, Input, Link } from '@joshicodes/cock';

	let { sent = false, brand = 'Quillwork' }: { sent?: boolean; brand?: string } = $props();

	let email = $state('');
	let submitted = $state(false);
	let wait = $state(0);
	let showSent = $derived(sent || submitted);

	$effect(() => {
		if (wait <= 0) return;
		const timer = setTimeout(() => wait--, 1000);
		return () => clearTimeout(timer);
	});

	function send(event: SubmitEvent) {
		event.preventDefault();
		submitted = true;
		wait = 30;
	}
</script>

<div class="flex min-h-[35rem] items-center justify-center bg-bg px-5 py-12">
	<div class="w-full max-w-sm">
		<p class="text-center font-serif text-xl text-fg italic">{brand}</p>

		{#if !showSent}
			<h1 class="mt-10 text-center text-3xl font-semibold tracking-tight text-balance text-fg">
				Sign in without a password
			</h1>
			<p class="mt-3 text-center text-sm leading-relaxed text-fg-muted">
				We’ll email you a link. Click it and you’re in, on this device or any other.
			</p>

			<form class="mt-8 space-y-3" onsubmit={send}>
				<Field label="Work email">
					{#snippet children(field)}
						<Input
							{...field}
							bind:value={email}
							type="email"
							autocomplete="email"
							placeholder="you@company.com"
							size="lg"
							required
						/>
					{/snippet}
				</Field>
				<Button type="submit" size="lg" block>Email me a link</Button>
			</form>

			<p class="mt-6 text-center text-sm text-fg-muted">
				Prefer a password? <Link href="/" variant="muted">Sign in the old way</Link>
			</p>
		{:else}
			<div class="mt-10 border-y border-border py-8 text-center" role="status">
				<svg viewBox="0 0 48 32" class="mx-auto h-8 text-accent" fill="none" aria-hidden="true">
					<rect x="1" y="1" width="46" height="30" rx="3" stroke="currentColor" stroke-width="2" />
					<path
						d="m2 3 22 16L46 3"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
					/>
				</svg>
				<h1 class="mt-5 text-2xl font-semibold tracking-tight text-fg">Check your inbox</h1>
				<p class="mt-2 text-sm leading-relaxed text-fg-muted">
					The link is on its way to
					<strong class="font-medium text-fg">{email || 'you@company.com'}</strong>. It works once
					and expires in fifteen minutes.
				</p>
			</div>

			<div class="mt-6 flex items-center justify-between gap-3">
				<Button variant="ghost" size="sm" onclick={() => (submitted = false)}>
					← Different email
				</Button>
				<Button variant="ghost" size="sm" disabled={wait > 0} onclick={() => (wait = 30)}>
					{wait > 0 ? `Resend in ${wait}s` : 'Resend link'}
				</Button>
			</div>
		{/if}
	</div>
</div>
