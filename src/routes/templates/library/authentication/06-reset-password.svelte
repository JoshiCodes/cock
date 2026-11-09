<!-- Choosing a new password: a strength bar, rules that light up as they are met, and a repeat field that speaks up on a mismatch. -->
<script lang="ts" module>
	export const meta = { height: 560 };
</script>

<script lang="ts">
	import { Badge, Button, Card, Field, Input, Link, Progress } from '@joshicodes/cock';

	let password = $state('');
	let confirm = $state('');

	let rules = $derived([
		{ label: '12+ characters', met: password.length >= 12 },
		{ label: 'Upper and lower case', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
		{ label: 'A number or symbol', met: /[\d\W_]/.test(password) }
	]);
	let score = $derived(rules.filter((rule) => rule.met).length);
	const levels = [
		{ label: 'Too weak', variant: 'danger' },
		{ label: 'Weak', variant: 'danger' },
		{ label: 'Almost there', variant: 'warning' },
		{ label: 'Strong', variant: 'success' }
	] as const;
	let level = $derived(levels[score]);
	let mismatch = $derived(confirm.length > 0 && confirm !== password);
</script>

<div class="flex min-h-[35rem] items-center justify-center bg-muted px-5 py-12">
	<Card padding="lg" variant="raised" class="w-full max-w-md">
		<h1 class="text-2xl font-semibold tracking-tight text-fg">Choose a new password</h1>
		<p class="mt-2 text-sm text-fg-muted">
			For avery@northstar.co. Other devices will be signed out.
		</p>

		<form class="mt-8 space-y-5" onsubmit={(event) => event.preventDefault()}>
			<Field label="New password">
				{#snippet children(field)}
					<Input
						{...field}
						bind:value={password}
						type="password"
						autocomplete="new-password"
						required
					/>
				{/snippet}
			</Field>

			<div>
				<div class="flex items-center justify-between text-sm">
					<span class="text-fg-muted">Strength</span>
					<span class="font-medium text-fg" aria-live="polite">
						{password ? level.label : '—'}
					</span>
				</div>
				<Progress
					value={password ? score + 1 : 0}
					max={4}
					size="sm"
					variant={level.variant}
					label="Password strength"
					class="mt-2"
				/>
				<div class="mt-4 flex flex-wrap gap-2">
					{#each rules as rule (rule.label)}
						<Badge variant={rule.met ? 'success' : 'neutral'}>
							{rule.met ? '✓' : '·'}
							{rule.label}
							<span class="sr-only">{rule.met ? 'done' : 'missing'}</span>
						</Badge>
					{/each}
				</div>
			</div>

			<Field label="Repeat it" error={mismatch ? 'The two don’t match yet.' : undefined}>
				{#snippet children(field)}
					<Input
						{...field}
						bind:value={confirm}
						type="password"
						autocomplete="new-password"
						required
					/>
				{/snippet}
			</Field>

			<Button type="submit" block disabled={score < 3 || confirm !== password}>
				Save and sign in
			</Button>
		</form>

		<p class="mt-6 text-center text-sm text-fg-muted">
			Remembered it after all? <Link href="/">Back to sign in</Link>
		</p>
	</Card>
</div>
