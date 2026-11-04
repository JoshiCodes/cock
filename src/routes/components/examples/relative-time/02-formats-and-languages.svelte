<!-- now pins the reference point, so this table reads the same on every visit. -->
<script lang="ts">
	import { RelativeTime } from '@joshicodes/cock';

	// How long he lasted before the hens lost interest.
	const now = new Date('2026-11-04T12:00:00Z');
	const date = new Date('2026-11-03T11:00:00Z');

	const rows = [
		{ locale: 'en-US', format: 'long', numeric: 'auto' },
		{ locale: 'en-US', format: 'long', numeric: 'always' },
		{ locale: 'en-US', format: 'short', numeric: 'always' },
		{ locale: 'de-DE', format: 'long', numeric: 'auto' },
		{ locale: 'fr-FR', format: 'long', numeric: 'auto' },
		{ locale: 'ja-JP', format: 'narrow', numeric: 'always' }
	] as const;
</script>

<table class="w-full max-w-md text-sm">
	<thead class="text-left text-xs text-fg-subtle">
		<tr>
			<th class="pb-2 font-medium">locale</th>
			<th class="pb-2 font-medium">format</th>
			<th class="pb-2 font-medium">numeric</th>
			<th class="pb-2 text-right font-medium">Output</th>
		</tr>
	</thead>
	<tbody class="divide-y divide-border">
		{#each rows as row, i (i)}
			<tr>
				<td class="py-2 font-mono text-xs text-fg-muted">{row.locale}</td>
				<td class="py-2 font-mono text-xs text-fg-muted">{row.format}</td>
				<td class="py-2 font-mono text-xs text-fg-muted">{row.numeric}</td>
				<td class="py-2 text-right text-fg">
					<RelativeTime
						{date}
						{now}
						locale={row.locale}
						format={row.format}
						numeric={row.numeric}
					/>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
