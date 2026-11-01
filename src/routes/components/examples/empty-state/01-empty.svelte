<script lang="ts">
	import { Button, EmptyState } from '@joshicodes/cock';
</script>

<EmptyState
	class="w-full"
	title="No messages yet"
	description="Don't worry, it happens to everyone. Messages will show up here once they arrive."
>
	{#snippet actions()}
		<Button size="sm">Write the first one</Button>
		<Button size="sm" variant="outline">Import</Button>
	{/snippet}
</EmptyState>
