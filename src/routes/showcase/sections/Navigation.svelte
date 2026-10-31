<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		Breadcrumb,
		Pagination,
		Tab,
		TabList,
		TabPanel,
		Tabs
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './Navigation.svelte?raw';
	import Demo from '../Demo.svelte';

	let tab = $state('overview');
	let range = $state('week');
	let page = $state(4);
	let open = $state<string | string[]>('name');
	let openMany = $state<string | string[]>(['work']);

	const crumbs = [
		{ label: 'Files', href: '#navigation' },
		{ label: 'Design', href: '#navigation' },
		{ label: 'Rooster, final, v14' }
	];
</script>

<Section
	{source}
	id="navigation"
	title="Navigation"
	description="Tabs respond to the arrow keys, Home and End. The aria wiring between a tab and its panel goes through context, so the markup in between is yours. Handles position changes with ease."
>
	<Demo title="Tabs" layout="col">
		<Tabs bind:value={tab}>
			<TabList>
				<Tab value="overview">Overview</Tab>
				<Tab value="activity">Activity</Tab>
				<Tab value="settings">Settings</Tab>
				<Tab value="billing" disabled>Billing</Tab>
			</TabList>

			<TabPanel value="overview">
				<p class="text-sm leading-relaxed text-fg-muted">
					The underlined variant suits page-level navigation.
				</p>
			</TabPanel>
			<TabPanel value="activity">
				<p class="text-sm leading-relaxed text-fg-muted">
					Panels only render while they are selected, so heavy content stays cheap.
				</p>
			</TabPanel>
			<TabPanel value="settings">
				<p class="text-sm leading-relaxed text-fg-muted">
					Try the left and right arrow keys once a tab has focus.
				</p>
			</TabPanel>
		</Tabs>
	</Demo>

	<Demo title="Pill tabs" layout="col">
		<Tabs bind:value={range} variant="pill">
			<TabList>
				<Tab value="day">Day</Tab>
				<Tab value="week">Week</Tab>
				<Tab value="month">Month</Tab>
			</TabList>

			<TabPanel value="day">
				<p class="text-sm text-fg-muted">The last 24 hours. A quickie.</p>
			</TabPanel>
			<TabPanel value="week">
				<p class="text-sm text-fg-muted">The last 7 days.</p>
			</TabPanel>
			<TabPanel value="month">
				<p class="text-sm text-fg-muted">The last 30 days. Long-term commitment.</p>
			</TabPanel>
		</Tabs>
	</Demo>

	<Demo title="Accordion" layout="col">
		<div class="grid gap-5 lg:grid-cols-2">
			<div class="space-y-2">
				<p class="text-sm font-medium text-fg-muted">One at a time</p>
				<Accordion bind:value={open}>
					<AccordionItem value="name" title="Why is it called cock?">
						Core Component Kit. The acronym was noticed afterwards and then kept on purpose.
					</AccordionItem>
					<AccordionItem value="theme" title="How do I theme it?">
						Set --ck-bg, --ck-fg and --ck-accent on :root. Surfaces, borders and secondary text are
						mixed from those three.
					</AccordionItem>
					<AccordionItem value="extend" title="Can I change a component?">
						Every component merges a class prop through tailwind-merge, so your utility wins over
						the default.
					</AccordionItem>
				</Accordion>
			</div>

			<div class="space-y-2">
				<p class="text-sm font-medium text-fg-muted">Several at once</p>
				<Accordion type="multiple" bind:value={openMany}>
					<AccordionItem value="work" title="Can I use it at work?">
						Yes. Maybe call it "the component kit" in the standup.
					</AccordionItem>
					<AccordionItem value="production" title="Is it ready for production?">
						It holds up well under pressure.
					</AccordionItem>
					<AccordionItem value="size" title="Does size matter?">
						Not at all. That said, it ships 63 components.
					</AccordionItem>
					<AccordionItem value="ssr" title="Does it work without JavaScript?">
						Everything renders on the server. Only the effects wait for the browser.
					</AccordionItem>
				</Accordion>
			</div>
		</div>
	</Demo>

	<Demo title="Breadcrumb and pagination" layout="col">
		<Breadcrumb items={crumbs} />
		<div class="flex flex-wrap items-center gap-4">
			<Pagination bind:page total={12} />
			<span class="text-sm text-fg-subtle">Page {page} of 12. Keep going.</span>
		</div>
	</Demo>
</Section>
