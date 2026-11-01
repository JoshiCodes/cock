<!-- The trigger snippet gets the attributes to spread, which keeps aria-expanded right. -->
<script lang="ts">
	import { Button, Field, Input, Popover, toast } from '@joshicodes/cock';
</script>

<Popover>
	{#snippet trigger(attrs)}
		<Button variant="outline" {...attrs}>Share</Button>
	{/snippet}

	{#snippet children({ close })}
		<div class="w-64 space-y-3">
			<p class="text-sm font-medium text-fg">Invite someone</p>
			<p class="text-xs text-fg-muted">It is more fun with more people.</p>
			<Field label="Email">
				{#snippet children({ id, ...rest })}
					<Input {id} {...rest} size="sm" placeholder="name@example.com" />
				{/snippet}
			</Field>
			<div class="flex justify-end gap-2">
				<Button size="sm" variant="ghost" onclick={close}>Cancel</Button>
				<Button
					size="sm"
					onclick={() => {
						close();
						toast.success('Invitation sent');
					}}
				>
					Send
				</Button>
			</div>
		</div>
	{/snippet}
</Popover>
