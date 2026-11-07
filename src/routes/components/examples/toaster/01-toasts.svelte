<!-- Needs the Toaster from the setup above. -->
<script lang="ts">
	import { Button, toast } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap gap-3">
	<Button variant="outline" size="sm" onclick={() => toast('Saved', { description: 'Firmly.' })}>
		Default
	</Button>

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
		onclick={() =>
			toast.error('Finished too early', {
				description: 'The upload stopped halfway.',
				duration: 0,
				action: { label: 'Try again', onclick: () => toast.success('Much better') }
			})}
	>
		Error that stays
	</Button>

	<Button variant="ghost" size="sm" onclick={() => toast.clear()}>Clear all</Button>
</div>
