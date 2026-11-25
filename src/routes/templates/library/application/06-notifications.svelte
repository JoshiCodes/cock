<!-- An inbox for the product's own notifications: unread first, grouped by day, with an empty state for when you have read them all. -->
<script lang="ts" module>
	export const meta = {
		height: 640,
		options: [{ name: 'empty', label: 'Nothing new', type: 'boolean', default: false }]
	};
</script>

<script lang="ts">
	import {
		Avatar,
		Button,
		Card,
		EmptyState,
		RelativeTime,
		Tab,
		TabList,
		Tabs
	} from '@joshicodes/cock';

	let { empty = false }: { empty?: boolean } = $props();

	interface Note {
		id: number;
		who: string;
		what: string;
		where: string;
		at: Date;
		unread: boolean;
	}

	const now = Date.now();
	const hour = 3_600_000;

	let notes = $state<Note[]>([
		{
			id: 1,
			who: 'Priya Raman',
			what: 'mentioned you in',
			where: 'Q4 launch plan',
			at: new Date(now - 0.2 * hour),
			unread: true
		},
		{
			id: 2,
			who: 'Oskar Lindgren',
			what: 'asked for your review on',
			where: 'Pricing page copy',
			at: new Date(now - 2 * hour),
			unread: true
		},
		{
			id: 3,
			who: 'Hana Kobayashi',
			what: 'resolved your comment on',
			where: 'Onboarding emails',
			at: new Date(now - 5 * hour),
			unread: true
		},
		{
			id: 4,
			who: 'Mateo Silva',
			what: 'shared',
			where: 'Customer interviews, round 3',
			at: new Date(now - 27 * hour),
			unread: false
		},
		{
			id: 5,
			who: 'Felix Brandt',
			what: 'invited you to',
			where: 'Design review',
			at: new Date(now - 30 * hour),
			unread: false
		},
		{
			id: 6,
			who: 'Amara Osei',
			what: 'replied in',
			where: 'Release notes 2.4',
			at: new Date(now - 52 * hour),
			unread: false
		}
	]);

	let filter = $state('all');
	let visible = $derived(
		empty ? [] : filter === 'unread' ? notes.filter((note) => note.unread) : notes
	);
	let unread = $derived(empty ? 0 : notes.filter((note) => note.unread).length);

	const today = new Date().toDateString();
	let groups = $derived([
		{ label: 'Today', items: visible.filter((note) => note.at.toDateString() === today) },
		{ label: 'Earlier', items: visible.filter((note) => note.at.toDateString() !== today) }
	]);

	function readAll() {
		for (const note of notes) note.unread = false;
	}
</script>

<section class="@container flex justify-center bg-muted px-5 py-10">
	<Card padding="none" class="w-full max-w-2xl overflow-hidden">
		<div class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
			<div>
				<h2 class="text-lg font-semibold tracking-tight text-fg">Notifications</h2>
				<p class="text-sm text-fg-muted">
					{unread ? `${unread} unread` : 'You are all caught up'}
				</p>
			</div>
			<div class="flex items-center gap-2">
				<Tabs bind:value={filter} variant="pill">
					<TabList>
						<Tab value="all">All</Tab>
						<Tab value="unread">Unread</Tab>
					</TabList>
				</Tabs>
				<Button variant="ghost" size="sm" onclick={readAll} disabled={!unread}>Mark all read</Button
				>
			</div>
		</div>

		{#if visible.length}
			{#each groups as group (group.label)}
				{#if group.items.length}
					<h3 class="bg-surface px-5 pt-4 pb-1.5 text-xs font-medium text-fg-subtle">
						{group.label}
					</h3>
					<ul class="divide-y divide-border">
						{#each group.items as note (note.id)}
							<li>
								<button
									type="button"
									onclick={() => (note.unread = false)}
									class="flex w-full cursor-pointer items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/60"
								>
									<Avatar name={note.who} size="sm" />
									<span class="min-w-0 flex-1 text-sm">
										<span class="text-fg-muted">
											<span class="font-medium text-fg">{note.who}</span>
											{note.what}
											<span class="font-medium text-fg">{note.where}</span>
										</span>
										<RelativeTime date={note.at} class="mt-0.5 block text-xs text-fg-subtle" />
									</span>
									{#if note.unread}
										<span class="mt-1.5 size-2 shrink-0 rounded-full bg-accent">
											<span class="sr-only">Unread</span>
										</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			{/each}
		{:else}
			<EmptyState
				class="border-0 py-16"
				title={filter === 'unread' && !empty ? 'Nothing unread' : 'No notifications yet'}
				description="When someone mentions you, shares something or asks for a review, it lands here."
			>
				{#snippet actions()}
					<Button size="sm" variant="outline">Notification settings</Button>
				{/snippet}
			</EmptyState>
		{/if}
	</Card>
</section>
