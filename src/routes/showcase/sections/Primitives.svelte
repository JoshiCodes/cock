<script lang="ts">
	import {
		Avatar,
		Badge,
		Button,
		Code,
		CopyButton,
		Kbd,
		Separator,
		Skeleton,
		Spinner,
		ThemeToggle
	} from '#lib';
	import Section from '../Section.svelte';
	import source from './Primitives.svelte?raw';
	import Demo from '../Demo.svelte';

	let publishing = $state(false);

	function publish() {
		publishing = true;
		setTimeout(() => (publishing = false), 1600);
	}
</script>

{#snippet plus()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet arrow()}
	<svg viewBox="0 0 24 24" fill="none" class="size-4" aria-hidden="true">
		<path
			d="M5 12h14m0 0-5-5m5 5-5 5"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
{/snippet}

<Section
	{source}
	id="primitives"
	title="Primitives"
	description="The small stuff. Every component takes a class prop that is merged with tailwind-merge, so a one-off override does not need a new variant. Small, but they get the job done."
>
	<Demo title="Button variants" description="Six ways to get pushed.">
		<Button>Save changes</Button>
		<Button variant="soft">Soft</Button>
		<Button variant="outline">Outline</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="danger">Delete</Button>
		<Button variant="link">Read the docs</Button>
	</Demo>

	<Demo title="Sizes, icons and state">
		<Button size="sm">Small</Button>
		<Button size="md">Average</Button>
		<Button size="lg">Impressive</Button>
		<Button size="icon" variant="outline" aria-label="Add item">{@render plus()}</Button>
		<Button size="icon-sm" variant="ghost" aria-label="Add item">{@render plus()}</Button>
		<Button loading={publishing} onclick={publish}>
			{publishing ? 'Publishing' : 'Publish'}
		</Button>
		<Button disabled>Archived</Button>
		<Button variant="outline" href="#primitives">
			As a link
			{@render arrow()}
		</Button>
	</Demo>

	<Demo title="Badge" description="Label things. It helps everyone know where they stand.">
		<Badge>Draft</Badge>
		<Badge variant="accent" dot>Featured</Badge>
		<Badge variant="success">Active</Badge>
		<Badge variant="warning">Pending</Badge>
		<Badge variant="danger" dot>Overdue</Badge>
		<Badge variant="info">New</Badge>
		<Badge variant="outline" size="sm">v0.1.0</Badge>
		<Badge variant="outline" size="sm">Hard-coded</Badge>
	</Demo>

	<Demo title="Avatar" description="With or without a picture. No pressure.">
		<Avatar name="Lena Weber" size="xs" />
		<Avatar name="Tom Fischer" size="sm" />
		<Avatar name="Mara Vogt" size="md" status="online" />
		<Avatar name="Jonas Keller" size="lg" status="busy" />
		<Avatar size="lg" shape="square" />
		<div class="flex -space-x-2">
			<Avatar name="Ida Brandt" class="rounded-full ring-2 ring-bg" />
			<Avatar name="Ole Peters" class="rounded-full ring-2 ring-bg" />
			<Avatar name="Pia Roth" class="rounded-full ring-2 ring-bg" />
		</div>
	</Demo>

	<Demo title="Inline marks" layout="col">
		<p class="text-sm text-fg-muted">
			Press <Kbd>⌘</Kbd>
			<Kbd>K</Kbd> to open the palette, or <Kbd>Esc</Kbd> if it all gets a bit much.
		</p>
		<p class="text-sm text-fg-muted">
			Install with <Code>bun add @joshicodes/cock</Code> and import from <Code
				>'@joshicodes/cock'</Code
			>. Say it with confidence.
		</p>
	</Demo>

	<Demo title="CopyButton" description="Copies a value and confirms it in place.">
		<CopyButton value="bun add @joshicodes/cock" />
		<CopyButton value="bun add @joshicodes/cock" label="Copy, don't be shy" variant="soft" />
		<CopyButton value="#903ead" iconOnly label="Copy colour" />
	</Demo>

	<Demo
		title="ThemeToggle"
		description="Switches light and dark through the theme state and remembers the choice. Some prefer it with the lights off."
	>
		<ThemeToggle />
		<ThemeToggle variant="segmented" />
	</Demo>

	<Demo title="Loading" description="For when it takes a while to get going." layout="col">
		<div class="flex items-center gap-4">
			<Spinner size="sm" />
			<Spinner />
			<Spinner size="lg" class="text-accent" />
		</div>
		<div class="flex items-center gap-3">
			<Skeleton class="size-10 shrink-0 rounded-full" />
			<div class="flex-1"><Skeleton lines={2} /></div>
		</div>
	</Demo>

	<Demo title="Separator" description="Sometimes you just need a little space." layout="col">
		<Separator />
		<Separator>or</Separator>
		<div class="flex h-8 items-center gap-4 text-sm text-fg-muted">
			<span>Drafts</span>
			<Separator orientation="vertical" />
			<span>Published</span>
			<Separator orientation="vertical" />
			<span>Archived</span>
		</div>
	</Demo>
</Section>
