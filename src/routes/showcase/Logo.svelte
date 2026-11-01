<script lang="ts">
	import { cn } from '@joshicodes/cock';

	// Same drawing as static/brand/*.svg, in theme colours so it follows the accent.
	interface Props {
		/** Show the wordmark next to the mark. */
		wordmark?: boolean;
		class?: string;
	}

	let { wordmark = false, class: className }: Props = $props();
</script>

<span class={cn('inline-flex items-center gap-2.5 text-fg', className)}>
	<svg viewBox="0 0 32 32" class="size-8 shrink-0" aria-hidden="true">
		<rect width="32" height="32" rx="7" fill="var(--ck-accent)" />
		<g fill="var(--ck-accent-fg)">
			<ellipse cx="11.7" cy="8.4" rx="1.9" ry="2.9" transform="rotate(-28 11.7 8.4)" />
			<ellipse cx="15.5" cy="6.7" rx="2.1" ry="3.3" transform="rotate(-6 15.5 6.7)" />
			<ellipse cx="19.2" cy="8" rx="1.8" ry="2.7" transform="rotate(18 19.2 8)" />
			<path d="M20.6 11.4 27.8 14.5 20.6 16.6Z" />
			<ellipse cx="22.7" cy="25.3" rx="1.6" ry="2.3" transform="rotate(-16 22.7 25.3)" />
			<circle cx="17.6" cy="15.7" r="1.3" />
		</g>
		<path
			d="M21.6 13.6A7.2 7.2 0 1 0 21.6 22.6"
			fill="none"
			stroke="var(--ck-accent-fg)"
			stroke-width="5"
			stroke-linecap="round"
		/>
	</svg>

	{#if wordmark}
		<svg viewBox="0 0 75.12 26.30" class="h-5 w-auto" role="img" aria-label="cock">
			<g
				fill="none"
				stroke="currentColor"
				stroke-width="4.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M14.66 12.50A7 7 0 1 0 14.66 21.50" />
				<circle cx="29.46" cy="17" r="7" />
				<path d="M56.62 12.50A7 7 0 1 0 56.62 21.50" />
				<path d="M64.42 4V24M64.82 18.2L72.42 10.6M67.82 16.6L72.82 24" />
			</g>
		</svg>
	{/if}
</span>
