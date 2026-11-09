<!-- A project dashboard: headline numbers with trends, a traffic chart, ninety days of uptime and the pages people actually read. -->
<script lang="ts" module>
	export const meta = { height: 760 };
</script>

<script lang="ts">
	import {
		Button,
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
		HistoryBar,
		Sparkline,
		Stat,
		Tab,
		TabList,
		Tabs,
		Table
	} from '@joshicodes/cock';
	import type { StatusTone } from '@joshicodes/cock';

	let range = $state('7d');

	const data = {
		'7d': {
			stats: ['2,840', '$12,480', '1,284', '4.8%'],
			traffic: [12, 16, 14, 21, 18, 25, 23, 31, 28, 36, 34, 43]
		},
		'30d': {
			stats: ['11,204', '$48,920', '5,740', '5.1%'],
			traffic: [20, 24, 22, 30, 26, 29, 35, 33, 38, 36, 41, 40]
		},
		'90d': {
			stats: ['32,860', '$142,600', '16,380', '5.4%'],
			traffic: [30, 28, 34, 31, 37, 35, 42, 39, 45, 44, 48, 52]
		}
	};
	let current = $derived(data[range as keyof typeof data]);

	// Seeded, so the picture is the same on every load.
	let seed = 7;
	const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
	const uptime: StatusTone[] = Array.from({ length: 90 }, () => {
		const roll = random();
		return roll < 0.02 ? 'danger' : roll < 0.06 ? 'warning' : 'success';
	});

	const pages = [
		{ path: '/pricing', views: '8,214', change: '+12%' },
		{ path: '/docs/getting-started', views: '6,930', change: '+4%' },
		{ path: '/blog/quiet-launches', views: '3,102', change: '+61%' },
		{ path: '/changelog', views: '1,877', change: '−3%' }
	];
</script>

<section class="@container bg-muted px-6 py-10">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Overview</h2>
				<p class="mt-1 text-sm text-fg-muted">northstar.co, all traffic</p>
			</div>
			<div class="flex items-center gap-3">
				<Tabs bind:value={range} variant="pill">
					<TabList>
						<Tab value="7d">7 days</Tab>
						<Tab value="30d">30 days</Tab>
						<Tab value="90d">90 days</Tab>
					</TabList>
				</Tabs>
				<Button variant="outline" size="sm">Export</Button>
			</div>
		</div>

		<Card class="mt-6">
			<div class="max-@2xl:divide-y grid divide-border @2xl:grid-cols-4 @2xl:divide-x">
				<Stat class="p-5" label="Visitors" value={current.stats[0]} change="12.8%" trend="up" />
				<Stat class="p-5" label="Revenue" value={current.stats[1]} change="8.2%" trend="up" />
				<Stat class="p-5" label="Sign-ups" value={current.stats[2]} change="3.1%" trend="up" />
				<Stat class="p-5" label="Conversion" value={current.stats[3]} change="0.4%" trend="down" />
			</div>
		</Card>

		<div class="mt-4 grid gap-4 @4xl:grid-cols-[1.4fr_1fr]">
			<Card>
				<CardHeader>
					<CardTitle>Traffic</CardTitle>
					<CardDescription>Visitors per day</CardDescription>
				</CardHeader>
				<CardContent class="text-accent">
					<Sparkline
						data={current.traffic}
						height={140}
						fill
						curve="smooth"
						label="Traffic is rising"
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Uptime</CardTitle>
					<CardDescription>99.93% over the last 90 days</CardDescription>
				</CardHeader>
				<CardContent>
					<HistoryBar
						data={uptime}
						height={40}
						start="90 days ago"
						end="Today"
						label="Uptime over the last 90 days"
						legend={[
							{ tone: 'success', label: 'Up' },
							{ tone: 'warning', label: 'Slow' },
							{ tone: 'danger', label: 'Down' }
						]}
					/>
				</CardContent>
			</Card>
		</div>

		<Card class="mt-4">
			<CardHeader>
				<CardTitle>Top pages</CardTitle>
			</CardHeader>
			<Table hoverable>
				<thead>
					<tr>
						<th>Page</th>
						<th class="text-right">Views</th>
						<th class="text-right">Change</th>
					</tr>
				</thead>
				<tbody>
					{#each pages as page (page.path)}
						<tr>
							<td class="font-medium">{page.path}</td>
							<td class="text-right tabular-nums">{page.views}</td>
							<td
								class="text-right tabular-nums {page.change.startsWith('+')
									? 'text-success'
									: 'text-danger'}">{page.change}</td
							>
						</tr>
					{/each}
				</tbody>
			</Table>
		</Card>
	</div>
</section>
