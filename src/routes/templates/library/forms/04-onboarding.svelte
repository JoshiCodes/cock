<!-- First-run setup in three steps: the workspace, the people in it and how they work. Next waits until a step is filled in. -->
<script lang="ts" module>
	export const meta = { height: 640 };
</script>

<script lang="ts">
	import {
		Button,
		Card,
		Field,
		Input,
		Radio,
		RadioGroup,
		Stepper,
		TagInput
	} from '@joshicodes/cock';

	let current = $state(0);
	let workspace = $state('');
	let address = $derived(
		workspace
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
	);
	let invites = $state<string[]>([]);
	let size = $state('small');
	let tried = $state(false);
	let done = $state(false);

	const steps = [
		{ title: 'Workspace', description: 'Name and address' },
		{ title: 'Team', description: 'Who joins you' },
		{ title: 'Setup', description: 'How you work' }
	];

	function validate(step: number) {
		tried = step === 0 && !workspace.trim();
		return !tried;
	}

	async function finish() {
		await new Promise((resolve) => setTimeout(resolve, 700));
		done = true;
	}
</script>

<section class="@container flex justify-center bg-muted px-5 py-12">
	<div class="w-full max-w-xl">
		<h2 class="text-2xl font-semibold tracking-tight text-fg">Set up your workspace</h2>
		<p class="mt-1 text-sm text-fg-muted">Two minutes now saves an afternoon later.</p>

		<Card padding="lg" class="mt-6">
			{#if done}
				<h3 class="text-lg font-semibold text-fg">{workspace} is ready.</h3>
				<p class="mt-2 text-sm text-fg-muted">
					{invites.length
						? `We sent ${invites.length} ${invites.length === 1 ? 'invite' : 'invites'}.`
						: 'You can invite people whenever you like.'}
					Your workspace lives at {address}.northstar.app.
				</p>
				<Button class="mt-6">Open the workspace</Button>
			{:else}
				<Stepper {steps} bind:current {validate} onfinish={finish} finishLabel="Create workspace">
					{#snippet children({ current })}
						{#if current === 0}
							<Field
								label="Workspace name"
								description="Your team signs in at {address || 'your-team'}.northstar.app."
								error={tried ? 'Give it a name, you can change it later.' : undefined}
								required
							>
								{#snippet children(field)}
									<Input {...field} bind:value={workspace} placeholder="Northstar" />
								{/snippet}
							</Field>
						{:else if current === 1}
							<Field
								label="Invite by email"
								description="Press Enter after each address. You can skip this."
							>
								{#snippet children(field)}
									<TagInput {...field} bind:value={invites} placeholder="name@company.com" />
								{/snippet}
							</Field>
						{:else}
							<RadioGroup bind:value={size} label="How big is the team?">
								<Radio value="solo" description="Just you, for now.">Only me</Radio>
								<Radio value="small" description="Everyone knows everyone.">2 to 20</Radio>
								<Radio value="large" description="We will set up groups for you."
									>More than 20</Radio
								>
							</RadioGroup>
						{/if}
					{/snippet}
				</Stepper>
			{/if}
		</Card>
	</div>
</section>
