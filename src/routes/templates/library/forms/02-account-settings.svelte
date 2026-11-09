<!-- Account settings in tabs: a profile card that saves with a toast, notification switches with descriptions, and a danger zone that asks first. -->
<script lang="ts" module>
	export const meta = {
		height: 680,
		options: [
			{
				name: 'tab',
				label: 'Open tab',
				type: 'select',
				default: 'profile',
				options: [
					{ value: 'profile', label: 'Profile' },
					{ value: 'notifications', label: 'Notifications' },
					{ value: 'account', label: 'Account' }
				]
			}
		]
	};
</script>

<script lang="ts">
	import {
		Avatar,
		Button,
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
		Field,
		Input,
		Modal,
		Switch,
		Tab,
		TabList,
		TabPanel,
		Tabs,
		Textarea,
		toast
	} from '@joshicodes/cock';

	let { tab = 'profile' }: { tab?: string } = $props();

	// Follows the option, but the tabs can still be clicked.
	let current = $state('profile');
	$effect.pre(() => {
		current = tab;
	});

	let name = $state('Avery Lindqvist');
	let confirming = $state(false);
</script>

<section class="@container bg-bg px-6 py-12">
	<div class="mx-auto max-w-3xl">
		<h2 class="text-2xl font-semibold tracking-tight text-fg">Settings</h2>

		<Tabs bind:value={current} class="mt-6">
			<TabList>
				<Tab value="profile">Profile</Tab>
				<Tab value="notifications">Notifications</Tab>
				<Tab value="account">Account</Tab>
			</TabList>

			<TabPanel value="profile" class="pt-6">
				<Card>
					<CardHeader>
						<CardTitle>Profile</CardTitle>
						<CardDescription>How you appear to the rest of the workspace.</CardDescription>
					</CardHeader>
					<CardContent class="space-y-5">
						<div class="flex items-center gap-4">
							<Avatar {name} size="lg" />
							<Button variant="outline" size="sm">Upload a photo</Button>
						</div>
						<div class="grid gap-5 @lg:grid-cols-2">
							<Field label="Name">
								{#snippet children(field)}
									<Input {...field} bind:value={name} autocomplete="name" />
								{/snippet}
							</Field>
							<Field label="Email" description="Changing it sends a confirmation link.">
								{#snippet children(field)}
									<Input {...field} type="email" value="avery@northstar.co" />
								{/snippet}
							</Field>
						</div>
						<Field label="About you" description="A line or two. Shown on your profile card.">
							{#snippet children(field)}
								<Textarea {...field} rows={3} autosize />
							{/snippet}
						</Field>
					</CardContent>
					<CardFooter divided class="justify-end">
						<Button onclick={() => toast.success('Profile saved')}>Save</Button>
					</CardFooter>
				</Card>
			</TabPanel>

			<TabPanel value="notifications" class="pt-6">
				<Card>
					<CardHeader>
						<CardTitle>Email notifications</CardTitle>
						<CardDescription>Sent to avery@northstar.co.</CardDescription>
					</CardHeader>
					<CardContent class="space-y-5">
						<Switch checked description="When someone mentions you or replies to you."
							>Mentions and replies</Switch
						>
						<Switch description="A short digest of what happened, every Monday morning."
							>Weekly summary</Switch
						>
						<Switch checked description="New sign-ins and password changes. We recommend it."
							>Security alerts</Switch
						>
						<Switch description="New features, roughly once a month.">Product news</Switch>
					</CardContent>
				</Card>
			</TabPanel>

			<TabPanel value="account" class="pt-6">
				<Card class="border-danger/40">
					<CardHeader>
						<CardTitle>Delete account</CardTitle>
						<CardDescription>
							Removes your profile and everything only you can see. Shared projects stay with the
							team.
						</CardDescription>
					</CardHeader>
					<CardFooter class="justify-end">
						<Button variant="danger" onclick={() => (confirming = true)}>Delete account</Button>
					</CardFooter>
				</Card>
			</TabPanel>
		</Tabs>
	</div>
</section>

<Modal bind:open={confirming} title="Delete your account?">
	<p class="text-sm text-fg-muted">This can’t be undone. You will be signed out straight away.</p>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (confirming = false)}>Keep it</Button>
		<Button variant="danger" onclick={() => (confirming = false)}>Delete for good</Button>
	{/snippet}
</Modal>
