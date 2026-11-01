<script lang="ts">
	import { Tab, TabList, TabPanel, Tabs } from '@joshicodes/cock';
	import CodeBlock from './CodeBlock.svelte';

	/** The package is on the public npm registry, so this is the whole install. */
	const managers = [
		{ id: 'bun', command: 'bun add @joshicodes/cock' },
		{ id: 'npm', command: 'npm install @joshicodes/cock' },
		{ id: 'pnpm', command: 'pnpm add @joshicodes/cock' },
		{ id: 'yarn', command: 'yarn add @joshicodes/cock' }
	];

	let manager = $state('bun');

	// Remember the choice between visits and across pages.
	$effect(() => {
		const saved = localStorage.getItem('ck-package-manager');
		if (saved && managers.some((entry) => entry.id === saved)) manager = saved;
	});
	$effect(() => {
		localStorage.setItem('ck-package-manager', manager);
	});
</script>

<Tabs bind:value={manager} variant="pill" class="gap-3">
	<TabList>
		{#each managers as option (option.id)}
			<Tab value={option.id}>{option.id}</Tab>
		{/each}
	</TabList>

	{#each managers as option (option.id)}
		<TabPanel value={option.id}>
			<div class="overflow-hidden rounded-lg border border-border">
				<CodeBlock code={option.command} label="terminal" />
			</div>
		</TabPanel>
	{/each}
</Tabs>
