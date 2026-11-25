<!-- Ask how it went: a rating, a reason that follows the score, and room to say more. Thanks the person instead of resetting. -->
<script lang="ts" module>
	export const meta = {
		height: 600,
		options: [{ name: 'contact', label: 'Ask to follow up', type: 'boolean', default: true }]
	};
</script>

<script lang="ts">
	import {
		Button,
		Card,
		Checkbox,
		Field,
		Rating,
		SegmentedControl,
		Textarea
	} from '@joshicodes/cock';

	let { contact = true }: { contact?: boolean } = $props();

	let score = $state(0);
	let reason = $state('');
	let message = $state('');
	let sent = $state(false);

	let reasons = $derived(
		score >= 4
			? ['Easy to use', 'Fast', 'Looks good', 'Saves time']
			: ['Confusing', 'Too slow', 'Missing a feature', 'Something broke']
	);
	const words = ['', 'Bad', 'Not great', 'Fine', 'Good', 'Excellent'];
</script>

<section class="@container flex justify-center bg-muted px-5 py-12">
	<Card padding="lg" class="w-full max-w-lg">
		{#if sent}
			<h2 class="text-xl font-semibold tracking-tight text-fg">Thank you.</h2>
			<p class="mt-2 text-sm text-fg-muted">
				Someone on the team reads every one of these. If you asked us to get back to you, we will
				within two working days.
			</p>
		{:else}
			<h2 class="text-xl font-semibold tracking-tight text-fg">How was your experience?</h2>
			<p class="mt-1 text-sm text-fg-muted">It takes a minute and it shapes what we build next.</p>

			<form
				class="mt-6 space-y-6"
				onsubmit={(event) => {
					event.preventDefault();
					sent = true;
				}}
			>
				<div class="flex items-center gap-4">
					<Rating bind:value={score} size="lg" label="Your rating" />
					<span class="text-sm text-fg-muted" aria-live="polite">{words[score]}</span>
				</div>

				{#if score}
					<div class="space-y-2">
						<p class="text-sm font-medium text-fg">
							{score >= 4 ? 'What did you like most?' : 'What got in the way?'}
						</p>
						<SegmentedControl
							bind:value={reason}
							options={reasons.map((label) => ({ value: label, label }))}
							label="Reason"
							size="sm"
							class="flex-wrap"
						/>
					</div>
				{/if}

				<Field label="Anything else?" description="Optional.">
					{#snippet children(field)}
						<Textarea {...field} bind:value={message} rows={4} autosize />
					{/snippet}
				</Field>

				{#if contact}
					<Checkbox>You can email me about this</Checkbox>
				{/if}

				<Button type="submit" block disabled={!score}>Send feedback</Button>
			</form>
		{/if}
	</Card>
</section>
