<!-- A public changelog: releases on a timeline, each with what is new, what got better and what was fixed. -->
<script lang="ts" module>
	export const meta = {
		height: 760,
		options: [{ name: 'subscribe', label: 'Subscribe box', type: 'boolean', default: true }]
	};
</script>

<script lang="ts">
	import {
		Badge,
		Button,
		Input,
		Timeline,
		TimelineItem,
		type BadgeVariant
	} from '@joshicodes/cock';

	let { subscribe = true }: { subscribe?: boolean } = $props();

	type Kind = 'New' | 'Improved' | 'Fixed';
	const tone: Record<Kind, BadgeVariant> = { New: 'accent', Improved: 'info', Fixed: 'neutral' };

	const releases: { version: string; date: string; title: string; changes: [Kind, string][] }[] = [
		{
			version: '2.4',
			date: '2026-11-18',
			title: 'Guests, finally',
			changes: [
				['New', 'Invite someone to a single project without giving them the whole workspace.'],
				['Improved', 'Comments now keep their place when the paragraph above them moves.'],
				['Fixed', 'Exported Markdown no longer doubles blank lines inside lists.']
			]
		},
		{
			version: '2.3',
			date: '2026-10-28',
			title: 'Faster search',
			changes: [
				['Improved', 'Search answers in under 100 ms on workspaces with 50,000 docs.'],
				['New', 'Filter results by author and by the month something was written.']
			]
		},
		{
			version: '2.2',
			date: '2026-10-07',
			title: 'Version compare',
			changes: [
				['New', 'Pick any two versions of a doc and see what changed, word by word.'],
				['Fixed', 'Pasting a table from a spreadsheet keeps its header row.']
			]
		}
	];

	const date = (value: string) =>
		new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
</script>

<section class="@container bg-bg px-6 py-14">
	<div class="mx-auto max-w-3xl">
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div>
				<h2 class="text-3xl font-semibold tracking-tight text-fg">Changelog</h2>
				<p class="mt-2 text-fg-muted">Everything we shipped, newest first.</p>
			</div>
			{#if subscribe}
				<form class="flex w-full gap-2 @xl:w-auto" onsubmit={(event) => event.preventDefault()}>
					<Input
						type="email"
						placeholder="you@company.com"
						aria-label="Email for release notes"
						size="sm"
						class="@xl:w-56"
					/>
					<Button type="submit" size="sm" variant="outline">Get updates</Button>
				</form>
			{/if}
		</div>

		<Timeline class="mt-10">
			{#each releases as release, i (release.version)}
				<TimelineItem
					title="{release.version} · {release.title}"
					time={date(release.date)}
					datetime={release.date}
					tone={i === 0 ? 'accent' : 'neutral'}
				>
					<ul class="mt-3 space-y-2.5">
						{#each release.changes as [kind, text] (text)}
							<li class="flex items-baseline gap-3 text-sm">
								<Badge variant={tone[kind]} size="sm" class="w-20 shrink-0 justify-center">
									{kind}
								</Badge>
								<span class="text-fg-muted">{text}</span>
							</li>
						{/each}
					</ul>
				</TimelineItem>
			{/each}
		</Timeline>
	</div>
</section>
