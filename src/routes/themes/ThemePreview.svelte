<script lang="ts">
	import {
		Alert,
		Badge,
		Button,
		Checkbox,
		Input,
		Progress,
		Sparkline,
		Switch,
		Tab,
		TabList,
		Table,
		Tabs
	} from '@joshicodes/cock';
	import { styleAttribute, type Theme } from './generate.js';

	interface Props {
		theme: Theme;
		scheme: 'light' | 'dark';
	}

	let { theme, scheme }: Props = $props();

	let tab = $state('flock');
	let alarm = $state(true);

	const week = [9, 11, 10, 12, 13, 12, 14];
	const flock = [
		{ name: 'Henrietta', status: 'Laying', tone: 'success', eggs: 6 },
		{ name: 'Gertrude', status: 'Broody', tone: 'warning', eggs: 1 },
		{ name: 'Doris', status: 'Molting', tone: 'neutral', eggs: 0 }
	] as const;

	let style = $derived(styleAttribute(theme[scheme], theme.radius));
</script>

<div data-ck-theme={scheme} {style} class="h-full">
	<div class="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
		<div class="flex items-center gap-2.5">
			<span class="size-5 rounded-sm bg-accent"></span>
			<span class="text-sm font-semibold text-fg">Cock &amp; Co. Farms</span>
		</div>
		<Tabs bind:value={tab} variant="pill">
			<TabList>
				<Tab value="flock">Flock</Tab>
				<Tab value="eggs">Eggs</Tab>
				<Tab value="feed">Feed</Tab>
			</TabList>
		</Tabs>
	</div>

	<div class="space-y-6 p-5">
		<div class="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-6">
			<div>
				<p class="text-xs text-fg-muted">Eggs today</p>
				<p class="text-4xl font-semibold tracking-tight text-fg tabular-nums">14</p>
			</div>
			<Sparkline data={week} height={44} label="Rising over the week" />
		</div>

		<Table tone="accent" dense hoverable={false}>
			<thead>
				<tr>
					<th>Hen</th>
					<th>Status</th>
					<th class="text-right">Eggs</th>
				</tr>
			</thead>
			<tbody>
				{#each flock as hen, index (hen.name)}
					<tr aria-selected={index === 0}>
						<td class="font-medium">{hen.name}</td>
						<td><Badge variant={hen.tone} size="sm">{hen.status}</Badge></td>
						<td class="text-right tabular-nums">{hen.eggs}</td>
					</tr>
				{/each}
			</tbody>
		</Table>

		<div class="space-y-3">
			<p class="text-sm font-medium text-fg">Register a hen</p>
			<div class="flex gap-2">
				<Input size="sm" placeholder="Name" />
				<Button size="sm">Add</Button>
			</div>
			<div class="flex flex-wrap gap-x-6 gap-y-3">
				<Switch size="sm" bind:checked={alarm}>Morning alarm</Switch>
				<Checkbox checked>Free-range</Checkbox>
			</div>
		</div>

		<Alert variant="warning" title="The rooster is up early. Again.">
			Nobody knows how he keeps it up every single morning.
		</Alert>

		<div class="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
			<div class="w-36 space-y-1.5">
				<p class="text-xs text-fg-muted">Feeder</p>
				<Progress value={32} size="sm" variant="warning" />
			</div>
			<div class="flex gap-2">
				<Button size="sm" variant="ghost">Cancel</Button>
				<Button size="sm" variant="outline">Preview</Button>
				<Button size="sm">Save</Button>
			</div>
		</div>
	</div>
</div>
