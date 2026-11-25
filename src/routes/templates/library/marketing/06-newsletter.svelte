<!-- A sign-up band for the bottom of a page: one field, one promise about what arrives, and a thank-you that replaces the form. -->
<script lang="ts" module>
	export const meta = {
		height: 420,
		options: [
			{
				name: 'tone',
				label: 'Background',
				type: 'select',
				default: 'accent',
				options: [
					{ value: 'accent', label: 'Accent' },
					{ value: 'plain', label: 'Plain' }
				]
			},
			{
				name: 'name',
				label: 'Newsletter',
				type: 'text',
				default: 'The Tuesday Note',
				placeholder: 'Name'
			}
		]
	};
</script>

<script lang="ts">
	import { Button, Input } from '@joshicodes/cock';

	let { tone = 'accent', name = 'The Tuesday Note' }: { tone?: 'accent' | 'plain'; name?: string } =
		$props();

	let email = $state('');
	let sent = $state(false);

	function subscribe(event: SubmitEvent) {
		event.preventDefault();
		if (email) sent = true;
	}
</script>

<section class="@container grid place-items-center bg-bg px-6 py-16">
	<div
		class="w-full max-w-4xl rounded-xl px-8 py-12 @3xl:px-14 {tone === 'accent'
			? 'bg-accent text-accent-fg'
			: 'border border-border bg-surface text-fg'}"
	>
		<div class="grid gap-8 @3xl:grid-cols-[1fr_22rem] @3xl:items-center">
			<div>
				<p class="text-sm font-medium opacity-75">{name}</p>
				<h2 class="mt-2 text-3xl font-semibold tracking-tight text-balance">
					One email a week. Only the parts worth reading.
				</h2>
				<p class="mt-3 opacity-80">
					What we shipped, what we learned, and one long read we liked. No tracking pixels.
				</p>
			</div>

			{#if sent}
				<p role="status" class="text-lg font-medium">
					Check {email} for a link to confirm. See you on Tuesday.
				</p>
			{:else}
				<form onsubmit={subscribe} class="space-y-3">
					<Input
						bind:value={email}
						type="email"
						required
						autocomplete="email"
						placeholder="you@company.com"
						aria-label="Email address"
						size="lg"
					/>
					<Button
						type="submit"
						size="lg"
						block
						class={tone === 'accent' ? 'bg-accent-fg text-accent hover:bg-accent-fg/90' : ''}
					>
						Subscribe
					</Button>
					<p class="text-xs opacity-70">Unsubscribe from any issue with one click.</p>
				</form>
			{/if}
		</div>
	</div>
</section>
