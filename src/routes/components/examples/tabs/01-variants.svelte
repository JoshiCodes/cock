<!-- Panels only render while selected. Try the arrow keys once a tab has focus. -->
<script lang="ts">
	import { Tab, TabList, TabPanel, Tabs } from '@joshicodes/cock';

	let page = $state('overview');
	let range = $state('week');
</script>

<div class="flex w-full flex-col gap-8">
	<Tabs bind:value={page}>
		<TabList>
			<Tab value="overview">Overview</Tab>
			<Tab value="activity">Activity</Tab>
			<Tab value="settings">Settings</Tab>
			<Tab value="billing" disabled>Billing</Tab>
		</TabList>

		<TabPanel value="overview">
			<p class="text-sm text-fg-muted">The underlined variant suits page-level navigation.</p>
		</TabPanel>
		<TabPanel value="activity">
			<p class="text-sm text-fg-muted">A panel costs nothing until it is opened.</p>
		</TabPanel>
		<TabPanel value="settings">
			<p class="text-sm text-fg-muted">Home and End jump to the first and last tab.</p>
		</TabPanel>
	</Tabs>

	<Tabs bind:value={range} variant="pill">
		<TabList>
			<Tab value="day">Day</Tab>
			<Tab value="week">Week</Tab>
			<Tab value="month">Month</Tab>
		</TabList>

		<TabPanel value="day"
			><p class="text-sm text-fg-muted">The last 24 hours. A quickie.</p></TabPanel
		>
		<TabPanel value="week"><p class="text-sm text-fg-muted">The last 7 days.</p></TabPanel>
		<TabPanel value="month">
			<p class="text-sm text-fg-muted">The last 30 days. Long-term commitment.</p>
		</TabPanel>
	</Tabs>
</div>
