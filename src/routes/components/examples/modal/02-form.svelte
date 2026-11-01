<script lang="ts">
	import { Button, Field, Input, Modal, Select, toast } from '@joshicodes/cock';

	let open = $state(false);

	const visibility = [
		{ value: 'private', label: 'Only me' },
		{ value: 'team', label: 'My team' },
		{ value: 'public', label: 'Anyone with the link' }
	];
</script>

<Button variant="outline" onclick={() => (open = true)}>Form dialog</Button>

<Modal bind:open title="New collection" size="sm">
	<div class="space-y-4">
		<Field label="Name" required>
			{#snippet children({ id, ...rest })}
				<Input {id} {...rest} placeholder="Reading list (not that kind)" />
			{/snippet}
		</Field>
		<Field label="Visible to">
			{#snippet children({ id, ...rest })}
				<Select {id} {...rest} options={visibility} placeholder="Pick one" />
			{/snippet}
		</Field>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Cancel</Button>
		<Button
			onclick={() => {
				open = false;
				toast.success('Collection created');
			}}
		>
			Create
		</Button>
	{/snippet}
</Modal>
