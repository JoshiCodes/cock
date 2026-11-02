<script lang="ts">
	import { Badge, Code, Table } from '@joshicodes/cock';
	import type { PropDoc } from '../components/props.server.js';
	import Inline from './Inline.svelte';

	interface Props {
		title: string;
		rows: PropDoc[];
		/** Names that have an entry on /docs/types; everything else stays plain text. */
		types?: string[];
		/** Shown when the component forwards the rest of its attributes. */
		forwards?: string;
	}

	let { title, rows, types = [], forwards }: Props = $props();

	let known = $derived(new Set(types));

	/**
	 * Split a type into words so the documented ones can be links. `Placement |
	 * undefined` links `Placement` and leaves the rest alone.
	 */
	function parts(type: string) {
		return type.split(/\b/).map((text) => ({ text, link: known.has(text) }));
	}

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
							<p class="mt-1.5 text-xs leading-relaxed text-fg-muted">
								<Inline text={row.description} />
							</p>
						{/if}
					</td>
					<td class="align-top">
						<!-- One line on purpose: a break between the parts would show up as a space. -->
						<!-- prettier-ignore -->
						<code class="font-mono text-xs break-words text-accent">{#each parts(row.type) as part, index (index)}{#if part.link}<a href="/docs/types#{part.text}" class="underline underline-offset-2">{part.text}</a>{:else}{part.text}{/if}{/each}</code>
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
