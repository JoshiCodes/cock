<!-- The frame most products start from: a sidebar with sections and a workspace switcher, a top bar with search, and room for the page. -->
<script lang="ts" module>
	export const meta = {
		height: 680,
		options: [
			{
				name: 'width',
				label: 'Sidebar',
				type: 'select',
				default: 'full',
				options: [
					{ value: 'full', label: 'Labels' },
					{ value: 'rail', label: 'Icons only' }
				]
			},
			{
				name: 'workspace',
				label: 'Workspace',
				type: 'text',
				default: 'Northstar',
				placeholder: 'Workspace'
			}
		]
	};
</script>

<script lang="ts">
	import {
		Avatar,
		Button,
		Card,
		DropdownMenu,
		Input,
		Kbd,
		MenuItem,
		MenuLabel,
		MenuSeparator,
		Progress,
		Tooltip
	} from '@joshicodes/cock';

	let { width = 'full', workspace = 'Northstar' }: { width?: 'full' | 'rail'; workspace?: string } =
		$props();

	let current = $state('Overview');

	const sections = [
		{
			label: 'Workspace',
			items: [
				{ name: 'Overview', icon: 'M3 10.5 10 4l7 6.5V17H3z' },
				{ name: 'Projects', icon: 'M3 5h5l2 2h7v10H3z' },
				{ name: 'Inbox', icon: 'M3 4h14v12H3zM3 11h4l1 2h4l1-2h4', count: 4 },
				{ name: 'Reports', icon: 'M4 17V9M10 17V3M16 17v-6' }
			]
		},
		{
			label: 'Account',
			items: [
				{
					name: 'Members',
					icon: 'M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 17c0-3 2.5-5 5-5s5 2 5 5M13 4a3 3 0 0 1 0 5M15 12c2 .5 3 2.5 3 5'
				},
				{
					name: 'Settings',
					icon: 'M10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM10 1v3M10 16v3M1 10h3M16 10h3M3.6 3.6l2.1 2.1M14.3 14.3l2.1 2.1M3.6 16.4l2.1-2.1M14.3 5.7l2.1-2.1'
				}
			]
		}
	];
</script>

{#snippet link(item: { name: string; icon: string; count?: number })}
	<a
		href="/"
		aria-current={current === item.name ? 'page' : undefined}
		aria-label={width === 'rail' ? item.name : undefined}
		onclick={(event) => {
			event.preventDefault();
			current = item.name;
		}}
		class="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-sm text-fg-muted transition-colors hover:bg-muted hover:text-fg aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-fg {width ===
		'rail'
			? 'justify-center'
			: ''}"
	>
		<svg
			viewBox="0 0 20 20"
			class="size-4 shrink-0"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d={item.icon} />
		</svg>
		{#if width === 'full'}
			<span class="flex-1">{item.name}</span>
			{#if item.count}
				<span class="text-xs text-fg-subtle tabular-nums">{item.count}</span>
			{/if}
		{/if}
	</a>
{/snippet}

<div
	class="@container grid min-h-[40rem] bg-bg {width === 'rail'
		? 'grid-cols-[4rem_1fr]'
		: '@2xl:grid-cols-[15rem_1fr]'}"
>
	<aside
		class="flex flex-col border-r border-border bg-surface {width === 'rail'
			? ''
			: 'max-@2xl:hidden'}"
	>
		<div class="flex h-14 items-center gap-2.5 border-b border-border px-4">
			<span
				class="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-sm font-semibold text-accent-fg"
			>
				{workspace.charAt(0)}
			</span>
			{#if width === 'full'}
				<span class="truncate text-sm font-semibold text-fg">{workspace}</span>
			{/if}
		</div>

		<nav aria-label="Main" class="flex-1 space-y-6 px-2 py-4">
			{#each sections as section (section.label)}
				<div>
					{#if width === 'full'}
						<p class="px-2 pb-1.5 text-xs font-medium text-fg-subtle">{section.label}</p>
					{/if}
					<ul class="space-y-0.5">
						{#each section.items as item (item.name)}
							<li>
								{#if width === 'rail'}
									<Tooltip content={item.name} placement="right">
										{@render link(item)}
									</Tooltip>
								{:else}
									{@render link(item)}
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>

		{#if width === 'full'}
			<div class="m-3 rounded-md border border-border p-3">
				<p class="text-xs font-medium text-fg">Storage</p>
				<Progress value={64} size="sm" label="Storage used" class="mt-2" />
				<p class="mt-2 text-xs text-fg-muted">6.4 of 10 GB used</p>
			</div>
		{/if}
	</aside>

	<div class="flex min-w-0 flex-col">
		<header class="flex h-14 items-center gap-3 border-b border-border px-4 @2xl:px-6">
			<div class="relative max-w-sm flex-1">
				<Input type="search" placeholder="Search" aria-label="Search" size="sm" />
				<Kbd class="max-@md:hidden pointer-events-none absolute top-1/2 right-2 -translate-y-1/2"
					>⌘K</Kbd
				>
			</div>
			<div class="ml-auto flex items-center gap-2">
				<Button size="sm">New project</Button>
				<DropdownMenu placement="bottom-end" label="Account">
					{#snippet trigger(props)}
						<button {...props} class="cursor-pointer rounded-full" aria-label="Account">
							<Avatar name="Avery Lindqvist" size="sm" />
						</button>
					{/snippet}
					<MenuLabel>avery@northstar.co</MenuLabel>
					<MenuItem>Profile</MenuItem>
					<MenuItem>Preferences</MenuItem>
					<MenuSeparator />
					<MenuItem variant="danger">Sign out</MenuItem>
				</DropdownMenu>
			</div>
		</header>

		<main class="flex-1 bg-muted p-4 @2xl:p-6">
			<h1 class="text-xl font-semibold tracking-tight text-fg">{current}</h1>
			<p class="mt-1 text-sm text-fg-muted">Your page goes here. The frame stays put.</p>
			<div class="mt-6 grid gap-4 @3xl:grid-cols-3">
				{#each ['This week', 'Open items', 'Shared with you'] as title (title)}
					<Card padding="md" class="min-h-32">
						<p class="text-sm font-medium text-fg">{title}</p>
						<div class="mt-4 space-y-2" aria-hidden="true">
							<div class="h-2 w-3/4 rounded-full bg-muted"></div>
							<div class="h-2 w-1/2 rounded-full bg-muted"></div>
						</div>
					</Card>
				{/each}
			</div>
		</main>
	</div>
</div>
