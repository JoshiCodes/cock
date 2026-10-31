<script lang="ts">
	import { Alert, Button, Progress, ProgressRing, Tooltip, toast } from '#lib';
	import Section from '../Section.svelte';
	import source from './Feedback.svelte?raw';
	import Demo from '../Demo.svelte';

	let foxDismissed = $state(false);
	let upload = $state(42);

	$effect(() => {
		const timer = setInterval(() => {
			upload = upload >= 100 ? 0 : upload + 4;
		}, 400);
		return () => clearInterval(timer);
	});
</script>

<Section
	{source}
	id="feedback"
	title="Feedback"
	description="Alerts sit in the page and stay until something changes. Toasts are for results that arrive after the user has moved on. Nobody likes to be left hanging."
>
	<Demo title="Alert" layout="col">
		<Alert variant="info" title="Scheduled maintenance">
			Saturday from 02:00 to 03:00 UTC. Things might go down for a bit.
		</Alert>
		<Alert variant="success" title="Payment received"
			>Thanks. A receipt is on its way, nice and discreet.</Alert
		>
		<Alert variant="warning" title="Storage almost full"
			>You have used 9.2 GB of 10 GB. Size does matter, apparently.</Alert
		>
		{#if !foxDismissed}
			<Alert
				variant="danger"
				title="Fox spotted near the coop"
				ondismiss={() => (foxDismissed = true)}
			>
				Doors are closed. Headcount in progress.
			</Alert>
		{:else}
			<Button variant="ghost" size="sm" onclick={() => (foxDismissed = false)}>
				Bring the fox back
			</Button>
		{/if}
		<Alert>Nothing to report. A plain alert for quiet context.</Alert>
	</Demo>

	<Demo title="Progress" layout="col">
		<div class="space-y-5">
			<div class="space-y-2">
				<div class="flex justify-between text-xs text-fg-muted">
					<span>Getting it up</span>
					<span class="tabular-nums">{upload}%</span>
				</div>
				<Progress value={upload} />
			</div>

			<div class="grid gap-4 sm:grid-cols-3">
				<Progress value={90} variant="success" size="sm" label="Tests" />
				<Progress value={55} variant="warning" size="sm" label="Memory" />
				<Progress value={20} variant="danger" size="sm" label="Disk" />
			</div>

			<div class="space-y-2">
				<p class="text-xs text-fg-muted">Indeterminate</p>
				<Progress />
			</div>
		</div>
	</Demo>

	<Demo title="ProgressRing" description="The round version, for compact spots and dashboards.">
		<ProgressRing value={upload} label="Upload" />
		<ProgressRing value={72} size={56} thickness={5} showValue label="Storage" />
		<ProgressRing value={92} size={56} thickness={5} showValue variant="success" label="Tests" />
		<ProgressRing value={38} size={56} thickness={5} showValue variant="warning" label="Budget" />
		<ProgressRing label="Loading" />
	</Demo>

	<Demo title="Toast">
		<Button variant="outline" size="sm" onclick={() => toast('Saved', { description: 'Firmly.' })}
			>Default</Button
		>
		<Button
			variant="outline"
			size="sm"
			onclick={() => toast.success('Payment received', { description: 'A receipt is on its way.' })}
		>
			Success
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() => toast.warning('Storage almost full', { description: '9.2 GB of 10 GB.' })}
		>
			Warning
		</Button>
		<Button
			variant="outline"
			size="sm"
			onclick={() =>
				toast.error('Finished too early', {
					description: 'The upload stopped halfway.',
					duration: 0,
					action: { label: 'Try again', onclick: () => toast.success('Much better') }
				})}
		>
			Error with action
		</Button>
		<Button variant="ghost" size="sm" onclick={() => toast.clear()}>Clear all</Button>
	</Demo>

	<Demo title="Tooltip">
		<Tooltip content="Don't just hover around it.">
			<Button variant="outline" size="sm">Top</Button>
		</Tooltip>
		<Tooltip content="Appears below. No judgement." placement="bottom">
			<Button variant="outline" size="sm">Bottom</Button>
		</Tooltip>
		<Tooltip content="Leans to the left, like most." placement="left">
			<Button variant="outline" size="sm">Left</Button>
		</Tooltip>
		<Tooltip content="To the right" placement="right">
			<Button variant="outline" size="sm">Right</Button>
		</Tooltip>
		<Tooltip content="Keyboard focus opens it too, so it works without a mouse.">
			<Button variant="ghost" size="sm">Long content</Button>
		</Tooltip>
	</Demo>
</Section>
