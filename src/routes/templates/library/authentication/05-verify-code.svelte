<!-- The second step after a sign-in or sign-up: a six-digit code that confirms itself once the last box is filled. -->
<script lang="ts" module>
	export const meta = {
		height: 520,
		options: [
			{
				name: 'channel',
				label: 'Sent by',
				type: 'select',
				default: 'email',
				options: [
					{ value: 'email', label: 'Email' },
					{ value: 'sms', label: 'Text message' },
					{ value: 'app', label: 'Authenticator app' }
				]
			}
		]
	};
</script>

<script lang="ts">
	import { Alert, Button, Card, Link, PinInput } from '@joshicodes/cock';

	let { channel = 'email' }: { channel?: 'email' | 'sms' | 'app' } = $props();

	const copy = {
		email: ['Check your inbox', 'We sent a code to avery@northstar.co.'],
		sms: ['Check your phone', 'We texted a code to the number ending in 42.'],
		app: ['Open your authenticator', 'Enter the code it shows for northstar.']
	};

	let code = $state('');
	let status = $state<'idle' | 'wrong' | 'done'>('idle');

	// Any code works in the demo except 000000, so the error state can be seen too.
	function check(value: string) {
		status = value === '000000' ? 'wrong' : 'done';
	}
</script>

<div class="flex min-h-[32rem] items-center justify-center bg-muted px-5 py-12">
	<Card padding="lg" variant="raised" class="w-full max-w-sm text-center">
		<p class="text-sm font-medium text-accent">Step 2 of 2</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-fg">{copy[channel][0]}</h1>
		<p class="mt-2 text-sm text-fg-muted">{copy[channel][1]}</p>

		<div class="mt-8 flex justify-center">
			<PinInput
				bind:value={code}
				length={6}
				group={3}
				invalid={status === 'wrong'}
				label="Verification code"
				oncomplete={check}
			/>
		</div>

		<div class="mt-6 text-left">
			{#if status === 'wrong'}
				<Alert variant="danger" title="That code didn’t match">
					Codes expire after ten minutes. Try again or ask for a new one.
				</Alert>
			{:else if status === 'done'}
				<Alert variant="success" title="You’re in">Taking you to your workspace.</Alert>
			{/if}
		</div>

		<Button block class="mt-6" disabled={code.length !== 6} onclick={() => check(code)}>
			Verify
		</Button>

		<p class="mt-6 text-sm text-fg-muted">
			{#if channel === 'app'}
				Lost your device? <Link href="/">Use a recovery code</Link>
			{:else}
				Nothing arrived? <Link href="/">Send a new code</Link>
			{/if}
		</p>
	</Card>
</div>
