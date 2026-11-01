<!-- Drop a file on it, or tab to it and press Enter. Nothing is uploaded. -->
<script lang="ts">
	import { Badge, Button, FileDrop } from '@joshicodes/cock';

	let files = $state<File[]>([]);

	const kb = (size: number) => `${Math.max(1, Math.round(size / 1024))} kB`;
</script>

<div class="w-full space-y-4">
	<FileDrop bind:files accept="image/*,.pdf" multiple hint="Images or PDFs, as many as you like" />

	{#if files.length}
		<ul class="divide-y divide-border rounded-lg border border-border">
			{#each files as file (file.name + file.lastModified)}
				<li class="flex items-center gap-3 px-3 py-2">
					<span class="min-w-0 flex-1 truncate text-sm text-fg">{file.name}</span>
					<Badge size="sm" variant="outline">{kb(file.size)}</Badge>
					<Button
						size="sm"
						variant="ghost"
						onclick={() => (files = files.filter((entry) => entry !== file))}
					>
						Remove
					</Button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
