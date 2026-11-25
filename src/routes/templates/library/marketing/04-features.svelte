<!-- The section under the hero: what the product does, in a numbered grid that reads like a list of promises rather than a wall of icons. -->
<script lang="ts" module>
	export const meta = {
		height: 640,
		options: [
			{
				name: 'columns',
				label: 'Columns',
				type: 'select',
				default: '3',
				options: [
					{ value: '2', label: 'Two' },
					{ value: '3', label: 'Three' }
				]
			},
			{ name: 'numbered', label: 'Numbers', type: 'boolean', default: true }
		]
	};
</script>

<script lang="ts">
	import { Button, Link } from '@joshicodes/cock';

	let { columns = '3', numbered = true }: { columns?: '2' | '3'; numbered?: boolean } = $props();

	const features = [
		{
			title: 'Plans that stay written down',
			body: 'Decisions live next to the work they change, so nobody has to dig through last month’s chat.'
		},
		{
			title: 'Reviews without the meeting',
			body: 'Ask for a look, leave comments on the exact line, and close the loop when it is settled.'
		},
		{
			title: 'History you can trust',
			body: 'Every edit is kept. Compare any two versions, or bring an old paragraph back in one click.'
		},
		{
			title: 'Guests who see only their part',
			body: 'Invite a client to one project. They get what they need and nothing you did not mean to share.'
		},
		{
			title: 'Search that knows the context',
			body: 'Find the doc by who wrote it, what it was about or roughly when, not just by its title.'
		},
		{
			title: 'An export that is really yours',
			body: 'Markdown and JSON, whenever you want them. Leaving should be as easy as arriving.'
		}
	];
</script>

<section class="@container bg-bg px-6 py-16">
	<div class="mx-auto max-w-5xl">
		<div class="grid gap-6 @3xl:grid-cols-[1fr_auto] @3xl:items-end">
			<div class="max-w-xl">
				<p class="text-sm font-medium text-accent">Why teams switch</p>
				<h2 class="mt-2 text-4xl font-semibold tracking-tight text-balance text-fg">
					The work, and the reasons behind it, in one place.
				</h2>
			</div>
			<div class="flex gap-3">
				<Button>Start free</Button>
				<Button variant="outline">See a demo</Button>
			</div>
		</div>

		<ol
			class="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border @xl:grid-cols-2 {columns ===
			'3'
				? '@4xl:grid-cols-3'
				: ''}"
		>
			{#each features as feature, i (feature.title)}
				<li class="bg-bg p-6">
					{#if numbered}
						<span class="text-sm font-semibold text-accent tabular-nums">
							{String(i + 1).padStart(2, '0')}
						</span>
					{/if}
					<h3 class="mt-3 font-semibold text-fg">{feature.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-fg-muted">{feature.body}</p>
				</li>
			{/each}
		</ol>

		<p class="mt-6 text-sm text-fg-muted">
			Missing something? <Link href="/">Read the roadmap</Link> or tell us what you need.
		</p>
	</div>
</section>
