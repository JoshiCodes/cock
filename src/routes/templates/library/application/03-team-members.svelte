<!-- Workspace members in a table: invite by email, change roles inline, and a menu per row for the rarer actions. -->
<script lang="ts" module>
	export const meta = {
		height: 620,
		options: [{ name: 'pending', label: 'Pending invites', type: 'boolean', default: true }]
	};
</script>

<script lang="ts">
	import {
		Avatar,
		Badge,
		Button,
		Card,
		CardDescription,
		CardHeader,
		CardTitle,
		DropdownMenu,
		Input,
		MenuItem,
		MenuSeparator,
		Select,
		Table,
		toast
	} from '@joshicodes/cock';

	let { pending = true }: { pending?: boolean } = $props();

	const roles = [
		{ value: 'admin', label: 'Admin' },
		{ value: 'member', label: 'Member' },
		{ value: 'guest', label: 'Guest' }
	];

	type Member = {
		name?: string;
		email: string;
		role: string;
		invited?: boolean;
		you?: boolean;
	};

	let members = $state<Member[]>([
		{ name: 'Avery Lindqvist', email: 'avery@northstar.co', role: 'admin', you: true },
		{ name: 'Tomás Ferreira', email: 'tomas@northstar.co', role: 'admin' },
		{ name: 'Ines Okafor', email: 'ines@northstar.co', role: 'member' },
		{ name: 'Jun Park', email: 'jun@studio-park.kr', role: 'guest' },
		{ email: 'mara@northstar.co', role: 'member', invited: true }
	]);
	let shown = $derived(pending ? members : members.filter((member) => !member.invited));

	let email = $state('');
	let role = $state('member');

	function invite(event: SubmitEvent) {
		event.preventDefault();
		if (!email) return;
		members.push({ email, role, invited: true });
		toast.success(`Invite sent to ${email}`);
		email = '';
	}

	function remove(member: Member) {
		members = members.filter((other) => other !== member);
	}
</script>

<section class="@container bg-bg px-6 py-12">
	<Card class="mx-auto max-w-4xl">
		<CardHeader divided>
			<CardTitle>Members</CardTitle>
			<CardDescription>
				{members.filter((member) => !member.invited).length} of 10 seats used on the Team plan.
			</CardDescription>
			{#snippet actions()}
				<form onsubmit={invite} class="flex flex-wrap gap-2">
					<Input
						bind:value={email}
						type="email"
						placeholder="name@company.com"
						aria-label="Email to invite"
						size="sm"
						class="w-52"
					/>
					<Select bind:value={role} options={roles} aria-label="Role" size="sm" class="w-28" />
					<Button type="submit" size="sm">Invite</Button>
				</form>
			{/snippet}
		</CardHeader>

		<Table hoverable>
			<thead>
				<tr>
					<th>Person</th>
					<th class="w-36">Role</th>
					<th class="w-12"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each shown as member (member.email)}
					<tr>
						<td>
							<div class="flex items-center gap-3">
								<Avatar name={member.name} size="sm" />
								<div class="min-w-0">
									<p class="truncate font-medium">
										{member.name ?? member.email}
										{#if member.you}<span class="font-normal text-fg-subtle">· you</span>{/if}
									</p>
									{#if member.invited}
										<p class="text-fg-muted">
											<Badge variant="warning" size="sm">Invited</Badge> hasn’t joined yet
										</p>
									{:else}
										<p class="truncate text-fg-muted">{member.email}</p>
									{/if}
								</div>
							</div>
						</td>
						<td>
							<Select
								bind:value={member.role}
								options={roles}
								size="sm"
								disabled={member.you}
								aria-label="Role for {member.name ?? member.email}"
							/>
						</td>
						<td class="text-right">
							<DropdownMenu label="Actions for {member.name ?? member.email}">
								{#snippet trigger(attrs)}
									<Button variant="ghost" size="icon-sm" {...attrs}>
										<span aria-hidden="true">⋯</span>
									</Button>
								{/snippet}
								{#if member.invited}
									<MenuItem onselect={() => toast(`Invite sent again to ${member.email}`)}
										>Resend invite</MenuItem
									>
									<MenuSeparator />
									<MenuItem variant="danger" onselect={() => remove(member)}>Revoke invite</MenuItem
									>
								{:else}
									<MenuItem href="mailto:{member.email}">Send an email</MenuItem>
									<MenuItem disabled={member.you}>Transfer ownership</MenuItem>
									<MenuSeparator />
									<MenuItem variant="danger" disabled={member.you} onselect={() => remove(member)}
										>Remove from workspace</MenuItem
									>
								{/if}
							</DropdownMenu>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</section>
