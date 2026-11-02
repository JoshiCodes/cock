<!-- Click, or take it from the keyboard: arrows walk, Right opens, Left closes, * opens a whole level, and typing a letter jumps. -->
<script lang="ts">
	import { TreeView, type TreeNode } from '@joshicodes/cock';

	const farm: TreeNode[] = [
		{
			id: 'coop',
			label: 'coop',
			children: [
				{
					id: 'nest-boxes',
					label: 'nest-boxes',
					children: [
						{ id: 'mabel', label: 'mabel.egg' },
						{ id: 'doris', label: 'doris.egg' },
						{ id: 'double', label: 'double-yolk.egg' }
					]
				},
				{ id: 'perch', label: 'perch.ts' },
				{ id: 'rooster', label: 'rooster.svelte' }
			]
		},
		{
			id: 'barn',
			label: 'barn',
			children: [
				{ id: 'hay', label: 'hay-loft.md' },
				{ id: 'roll', label: 'roll-in-the-hay.md', disabled: true }
			]
		},
		{ id: 'fence', label: 'fence.config.ts' },
		{ id: 'readme', label: 'README.md' }
	];

	let expanded = $state(['coop', 'nest-boxes']);
	let selected = $state<string | null>('double');
</script>

<div class="grid w-full gap-6 sm:grid-cols-[16rem_1fr]">
	<div class="rounded-lg border border-border bg-surface p-1.5">
		<TreeView items={farm} bind:expanded bind:selected label="The farm">
			{#snippet item(node)}
				<span class="font-mono text-[0.8125rem]">{node.label}{node.children ? '/' : ''}</span>
			{/snippet}
		</TreeView>
	</div>
	<p class="text-sm text-fg-muted">
		{selected === 'double'
			? 'Two yolks, one shell. Somebody was busy.'
			: selected
				? `Opened ${selected}.`
				: 'Nothing open.'} The hay-loft roll is disabled; some things are private.
	</p>
</div>
