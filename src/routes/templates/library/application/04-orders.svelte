<!-- An order list you can search, filter by status and sort. Tick rows to act on several at once. -->
<script lang="ts" module>
	export const meta = {
		height: 720,
		options: [
			{ name: 'selectable', label: 'Row selection', type: 'boolean', default: true },
			{ name: 'dense', label: 'Dense rows', type: 'boolean', default: false }
		]
	};
</script>

<script lang="ts">
	import {
		Badge,
		Button,
		DataTable,
		Input,
		SegmentedControl,
		toast,
		type BadgeVariant,
		type DataTableColumn
	} from '@joshicodes/cock';

	let { selectable = true, dense = false }: { selectable?: boolean; dense?: boolean } = $props();

	type Status = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

	interface Order {
		id: string;
		customer: string;
		email: string;
		placed: Date;
		items: number;
		total: number;
		status: Status;
	}

	const customers = [
		['Lena Hartmann', 'lena@hartmann.studio'],
		['Oskar Lindgren', 'oskar@lindgren.se'],
		['Priya Raman', 'priya@tidewater.io'],
		['Mateo Silva', 'mateo@silva.pt'],
		['Hana Kobayashi', 'hana@kobayashi.jp'],
		['Felix Brandt', 'felix@brandt.de'],
		['Amara Osei', 'amara@osei.gh'],
		['Jonas Weber', 'jonas@weber.at'],
		['Chloé Martin', 'chloe@martin.fr'],
		['Noah Fischer', 'noah@fischer.ch'],
		['Sofia Rossi', 'sofia@rossi.it'],
		['Elias Novak', 'elias@novak.cz']
	];
	const statuses: Status[] = ['Paid', 'Paid', 'Pending', 'Paid', 'Refunded', 'Paid', 'Failed'];

	const orders: Order[] = customers.map(([customer, email], i) => ({
		id: `#${4120 - i}`,
		customer,
		email,
		placed: new Date(2026, 10, 24 - i * 2, 9 + ((i * 5) % 9)),
		items: 1 + ((i * 7) % 4),
		total: 24 + ((i * 53) % 310) + 0.9,
		status: statuses[i % statuses.length]
	}));

	const tone: Record<Status, BadgeVariant> = {
		Paid: 'success',
		Pending: 'warning',
		Refunded: 'neutral',
		Failed: 'danger'
	};

	const columns: DataTableColumn<Order>[] = [
		{ key: 'id', header: 'Order', sortable: true, class: 'font-medium tabular-nums' },
		{ key: 'customer', header: 'Customer', sortable: true },
		{ key: 'placed', header: 'Placed', sortable: true },
		{ key: 'status', header: 'Status' },
		{ key: 'total', header: 'Total', sortable: true, align: 'right', class: 'tabular-nums' }
	];

	let query = $state('');
	let status = $state('all');
	let selected = $state<string[]>([]);

	let shown = $derived(
		status === 'all' ? orders : orders.filter((order) => order.status.toLowerCase() === status)
	);

	const date = (value: Date) =>
		value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	const money = (value: number) =>
		value.toLocaleString('en-US', { style: 'currency', currency: 'EUR' });
</script>

<section class="@container bg-muted px-6 py-10">
	<div class="mx-auto max-w-6xl">
		<div class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight text-fg">Orders</h2>
				<p class="mt-1 text-sm text-fg-muted">{orders.length} orders in the last 30 days</p>
			</div>
			<Button variant="outline" size="sm">Export CSV</Button>
		</div>

		<div class="mt-6 flex flex-wrap items-center justify-between gap-3">
			<SegmentedControl
				bind:value={status}
				options={[
					{ value: 'all', label: 'All' },
					{ value: 'paid', label: 'Paid' },
					{ value: 'pending', label: 'Pending' },
					{ value: 'refunded', label: 'Refunded' }
				]}
				label="Filter by status"
				size="sm"
			/>
			<Input
				bind:value={query}
				type="search"
				placeholder="Search orders"
				aria-label="Search orders"
				size="sm"
				class="w-full @md:w-64"
			/>
		</div>

		{#if selected.length}
			<div
				class="mt-3 flex items-center justify-between gap-3 rounded-md bg-accent-soft px-4 py-2 text-sm"
			>
				<span class="text-fg">{selected.length} selected</span>
				<div class="flex gap-2">
					<Button
						size="sm"
						variant="ghost"
						onclick={() => toast(`Sent ${selected.length} receipts`)}
					>
						Send receipts
					</Button>
					<Button size="sm" variant="ghost" onclick={() => (selected = [])}>Clear</Button>
				</div>
			</div>
		{/if}

		<DataTable
			class="mt-3"
			rows={shown}
			{columns}
			rowKey={(order) => order.id}
			{query}
			{selectable}
			{dense}
			bind:selected
			pageSize={8}
			empty="No order matches that."
		>
			{#snippet cell({ row, column, value })}
				{#if column.key === 'customer'}
					<span class="block text-fg">{row.customer}</span>
					<span class="block text-xs text-fg-subtle">{row.email}</span>
				{:else if column.key === 'placed'}
					{date(row.placed)}
				{:else if column.key === 'status'}
					<Badge variant={tone[row.status]} size="sm">{row.status}</Badge>
				{:else if column.key === 'total'}
					{money(row.total)}
				{:else}
					{value}
				{/if}
			{/snippet}
		</DataTable>
	</div>
</section>
