<script lang="ts">
	import { Badge, Code, Table } from '@joshicodes/cock';
	import type { PropDoc } from '../components/props.server.js';

	interface Props {
		title: string;
		rows: PropDoc[];
		/** Shown when the component forwards the rest of its attributes. */
		forwards?: string;
	}

	let { title, rows, forwards }: Props = $props();

	const columns: Record<string, string> = {
		prop: 'Prop',
		snippet: 'Snippet',
		event: 'Event'
	};
	let kind = $derived(columns[rows[0]?.kind] ?? 'Prop');
</script>

<section class="space-y-3">
	<h3 class="text-base font-semibold text-fg">{title}</h3>

	<Table>
		<thead>
			<tr>
				<th class="w-48">{kind}</th>
				<th>Type</th>
				<th class="w-32">Default</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row (row.name)}
				<tr>
					<td class="align-top">
						<div class="flex flex-wrap items-center gap-1.5">
							<Code>{row.name}</Code>
							{#if row.required}
								<Badge variant="outline" size="sm">required</Badge>
							{/if}
							{#if row.bindable}
								<Badge variant="accent" size="sm">bindable</Badge>
							{/if}
						</div>
						{#if row.description}
							<p class="mt-1.5 text-xs leading-relaxed text-fg-muted">{row.description}</p>
						{/if}
					</td>
					<td class="align-top">
						<code class="font-mono text-xs break-words text-accent">{row.type}</code>
					</td>
					<td class="align-top">
						{#if row.default}
							<code class="font-mono text-xs break-words text-fg-muted">{row.default}</code>
						{:else}
							<span class="text-fg-subtle">—</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</Table>

	{#if forwards}
		<p class="text-sm text-fg-muted">
			Anything else is forwarded to the underlying element, typed as
			<Code>{forwards}</Code>.
		</p>
	{/if}
</section>
