<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
		EmptyState,
		toast
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './LayoutSection.svelte?raw';
	import Demo from '../Demo.svelte';
</script>

<Section
	{source}
	id="layout"
	title="Layout"
	description="Cards come in parts: header, content and footer. Skip them and set the padding prop when you only need a box. Comes in four positions."
>
	<Demo title="Card" layout="grid">
		<Card>
			<CardHeader>
				<CardTitle>Weekly digest</CardTitle>
				<CardDescription>Goes out every Monday at 8:00.</CardDescription>
				{#snippet actions()}
					<Badge variant="success">Scheduled</Badge>
				{/snippet}
			</CardHeader>
			<CardContent>
				<p class="text-sm leading-relaxed text-fg-muted">
					1,284 subscribers. Last week's issue was opened by 61 percent of them, which is better
					than most meetings manage.
				</p>
			</CardContent>
			<CardFooter>
				<Button size="sm" onclick={() => toast.success('Issue saved')}>Edit issue</Button>
				<Button size="sm" variant="ghost">Preview</Button>
			</CardFooter>
		</Card>

		<Card>
			<CardHeader divided>
				<CardTitle>Feedback on the name</CardTitle>
				<CardDescription>Collected from fourteen standups.</CardDescription>
			</CardHeader>
			<CardContent class="pt-5">
				<ul class="space-y-2 text-sm text-fg-muted">
					<li>"Can we not?" <span class="text-fg-subtle">— everyone, at first</span></li>
					<li>"It's growing on me." <span class="text-fg-subtle">— most of them, later</span></li>
					<li>
						"Bigger than I expected." <span class="text-fg-subtle">— the one who read the docs</span
						>
					</li>
				</ul>
			</CardContent>
			<CardFooter>
				<Button size="sm" variant="outline">Keep the name</Button>
				<Button size="sm" variant="ghost" disabled>Rename</Button>
			</CardFooter>
		</Card>
	</Demo>

	<Demo
		title="Card variants"
		description="Flat by default. Elevated adds depth, raised lifts when you hover it, flat fills instead of outlining."
		layout="bare"
	>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card padding="md">
				<p class="text-sm font-medium text-fg">Default</p>
				<p class="mt-1 text-sm text-fg-muted">A border, nothing else.</p>
			</Card>
			<Card variant="elevated" padding="md">
				<p class="text-sm font-medium text-fg">Elevated</p>
				<p class="mt-1 text-sm text-fg-muted">Sits a little higher than the rest.</p>
			</Card>
			<Card variant="raised" padding="md">
				<p class="text-sm font-medium text-fg">Raised</p>
				<p class="mt-1 text-sm text-fg-muted">Hover it. It rises to the occasion.</p>
			</Card>
			<Card variant="flat" padding="md">
				<p class="text-sm font-medium text-fg">Flat</p>
				<p class="mt-1 text-sm text-fg-muted">Filled, no outline.</p>
			</Card>
		</div>
	</Demo>

	<Demo title="Empty state" layout="bare">
		<EmptyState
			title="No messages yet"
			description="Don't worry, it happens to everyone. Messages will show up here once they arrive."
		>
			{#snippet actions()}
				<Button size="sm">Write the first one</Button>
				<Button size="sm" variant="outline">Import</Button>
			{/snippet}
		</EmptyState>
	</Demo>
</Section>
