<script lang="ts">
	import {
		Button,
		Checkbox,
		Field,
		Input,
		PinInput,
		Radio,
		RadioGroup,
		Select,
		Slider,
		Switch,
		TagInput,
		Textarea,
		toast
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './Forms.svelte?raw';
	import Demo from '../Demo.svelte';

	let email = $state('');
	let notes = $state('');
	let message = $state('');
	let country = $state('de');
	let delivery = $state('standard');
	let notifications = $state(true);
	let terms = $state(false);
	let volume = $state(65);
	let code = $state('');
	let interests = $state(['design', 'svelte', 'long walks']);

	let emailError = $derived(
		email.length > 0 && !email.includes('@') ? 'That does not look like an email address.' : ''
	);

	const countries = [
		{ value: 'de', label: 'Germany' },
		{ value: 'at', label: 'Austria' },
		{ value: 'ch', label: 'Switzerland' },
		{ value: 'nl', label: 'Netherlands' }
	];
</script>

{#snippet search()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.75" />
		<path d="m16 16 4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
	</svg>
{/snippet}

<Section
	{source}
	id="forms"
	title="Forms"
	description="Every control works with bind:value or bind:checked. Field connects the label, help text and error message to the control, including the aria attributes. They handle input really well."
>
	<Demo
		title="Field"
		description="Pass the generated id straight through to the control."
		layout="col"
	>
		<div class="grid gap-5 sm:grid-cols-2">
			<Field
				label="Email"
				description="Only used for receipts. Promise."
				error={emailError}
				required
			>
				{#snippet children({ id, invalid, ...rest })}
					<Input
						{id}
						{invalid}
						{...rest}
						bind:value={email}
						type="email"
						placeholder="you@example.com"
					/>
				{/snippet}
			</Field>

			<Field label="Country" description="Decides the currency at checkout.">
				{#snippet children({ id, ...rest })}
					<Select {id} {...rest} bind:value={country} options={countries} />
				{/snippet}
			</Field>
		</div>
	</Demo>

	<Demo title="Input" layout="col">
		<div class="grid gap-3 sm:grid-cols-2">
			<Input placeholder="Default" />
			<Input size="sm" placeholder="Search, we won't judge" leading={search} />
			<Input size="lg" placeholder="Large (we noticed)" />
			<Input value="not-an-email" invalid />
			<Input value="Disabled, not dead" disabled />
			<Input type="password" value="hunter2" />
		</div>
	</Demo>

	<Demo title="Textarea" layout="col">
		<Textarea
			bind:value={notes}
			placeholder="Grows as you type. Give it a moment."
			autosize
			rows={2}
		/>
	</Demo>

	<Demo title="Checkbox, radio, switch" layout="col">
		<div class="grid gap-7 sm:grid-cols-3">
			<div class="space-y-3">
				<p class="text-sm font-medium text-fg-muted">Checkbox</p>
				<Checkbox bind:checked={terms} description="Required. We don't make the rules.">
					I'm old enough for this package name
				</Checkbox>
				<Checkbox checked indeterminate>Some items selected</Checkbox>
				<Checkbox disabled>Disabled</Checkbox>
			</div>

			<div class="space-y-3">
				<p class="text-sm font-medium text-fg-muted">Radio</p>
				<RadioGroup bind:value={delivery} label="Delivery">
					<Radio value="standard" description="Takes its time, like it should">Standard</Radio>
					<Radio value="express" description="Comes quickly">Express</Radio>
					<Radio value="pickup" disabled>Pick up in person (we're shy)</Radio>
				</RadioGroup>
			</div>

			<div class="space-y-3">
				<p class="text-sm font-medium text-fg-muted">Switch</p>
				<Switch bind:checked={notifications} description="Stays signed in for 30 days.">
					Keep it up
				</Switch>
				<Switch size="sm" aria-label="Compact switch" />
				<Switch disabled aria-label="Disabled switch" />
			</div>
		</div>
	</Demo>

	<Demo title="Slider" layout="col">
		<Slider
			bind:value={volume}
			label="Morning crow volume"
			showValue
			format={(value) => `${value}%`}
		/>
	</Demo>

	<Demo
		title="PinInput"
		description="One box per character. Paste and one-time-code autofill land in the right boxes."
		layout="col"
	>
		<PinInput
			bind:value={code}
			length={6}
			group={3}
			label="Verification code"
			oncomplete={(value) =>
				toast.success('Code accepted', { description: `${value}. You're in.` })}
		/>
	</Demo>

	<Demo
		title="TagInput"
		description="Enter or a comma adds a tag, Backspace in an empty field removes the last one."
		layout="col"
	>
		<TagInput bind:value={interests} placeholder="Add an interest…" max={6} />
	</Demo>

	<Demo
		title="Inside a form"
		description="Field, Input, Textarea, Checkbox and Button in a plain <form>. Nothing is intercepted."
		layout="bare"
	>
		<form
			class="max-w-md space-y-5"
			onsubmit={(event) => {
				event.preventDefault();
				toast.success('Message sent', {
					description: 'Nothing was actually sent. Not even a wink.'
				});
			}}
		>
			<Field label="Name" required>
				{#snippet children({ id, ...rest })}
					<Input {id} {...rest} placeholder="Lena Weber" required />
				{/snippet}
			</Field>

			<Field label="Message" description="Plain text, no attachments.">
				{#snippet children({ id, ...rest })}
					<Textarea {id} {...rest} bind:value={message} rows={3} placeholder="Hi there," />
				{/snippet}
			</Field>

			<Checkbox>Send me a copy, I like to watch</Checkbox>

			<div class="flex gap-2">
				<Button type="submit">Send message</Button>
				<Button type="button" variant="ghost">Cancel</Button>
			</div>
		</form>
	</Demo>
</Section>
