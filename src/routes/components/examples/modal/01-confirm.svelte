<script lang="ts">
	import { Button, Modal, toast } from '@joshicodes/cock';

	let open = $state(false);
</script>

<Button variant="outline" onclick={() => (open = true)}>Confirm dialog</Button>

<Modal
	bind:open
	title="Rename the package?"
	description="You could call it something sensible. Nobody would remember it."
>
	<p class="text-fg-muted">
		Fourteen people have asked so far. The answer has not changed, but the button works.
	</p>

	{#snippet footer()}
		<Button variant="ghost" onclick={() => (open = false)}>Keep the name</Button>
		<Button
			variant="danger"
			onclick={() => {
				open = false;
				toast('Nice try', { description: 'The name stays.' });
			}}
		>
			Rename anyway
		</Button>
	{/snippet}
</Modal>
