<!-- Header, content and footer are separate components, so you can leave any of them out. -->
<script lang="ts">
	import {
		Badge,
		Button,
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@joshicodes/cock';
</script>

<Card class="max-w-md">
	<CardHeader>
		<CardTitle>Weekly digest</CardTitle>
		<CardDescription>Goes out every Monday at 8:00.</CardDescription>
		{#snippet actions()}
			<Badge variant="success">Scheduled</Badge>
		{/snippet}
	</CardHeader>

	<CardContent>
		<p class="text-sm leading-relaxed text-fg-muted">
			1,284 subscribers. Last week's issue was opened by 61 percent of them, which is better than
			most meetings manage.
		</p>
	</CardContent>

	<CardFooter>
		<Button size="sm">Edit issue</Button>
		<Button size="sm" variant="ghost">Preview</Button>
	</CardFooter>
</Card>
