<!-- The bars share the width; on a narrow screen the row scrolls instead of squeezing them to nothing. -->
<script lang="ts">
	import { HistoryBar, StatusDot } from '@joshicodes/cock';
	import type { StatusTone } from '@joshicodes/cock';

	// Seeded, so the picture is the same on every load.
	let seed = 11;
	const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

	const days: (StatusTone | null)[] = Array.from({ length: 90 }, (_, day) => {
		if (day < 6) return null;
		const roll = random();
		if (roll < 0.03) return 'danger';
		if (roll < 0.09) return 'warning';
		return 'success';
	});

	const meaning = {
		success: 'Up all day',
		warning: 'Performance issues',
		danger: 'Down',
		info: 'Maintenance',
		accent: 'Up',
		neutral: 'Unknown'
	};

	const first = new Date('2026-08-07');
	const dayOf = (index: number) =>
		new Date(first.getTime() + index * 86_400_000).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});

	// Performance issues still count as up. He'd want it that way.
	const good = days.filter((tone) => tone === 'success' || tone === 'warning').length;
	const counted = days.filter((tone) => tone !== null).length;
</script>

<div class="w-full space-y-3">
	<div class="flex items-center justify-between gap-4">
		<StatusDot tone="success" class="font-medium">Rooster</StatusDot>
		<span class="text-sm text-fg-muted tabular-nums">
			{((good / counted) * 100).toFixed(1)}% uptime
		</span>
	</div>

	<HistoryBar
		data={days}
		describe={(tone, index) => `${dayOf(index)}: ${tone ? meaning[tone] : 'Not installed yet'}`}
		start="90 days ago"
		end="Today"
		legend={[
			{ tone: 'success', label: 'Up' },
			{ tone: 'warning', label: 'Performance issues' },
			{ tone: 'danger', label: 'Down' },
			{ tone: null, label: 'No data' }
		]}
		label="Rooster uptime over the last 90 days: mostly up, a few bad days"
	/>
</div>
