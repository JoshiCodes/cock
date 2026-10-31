<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		src?: string;
		alt?: string;
		/** Falls back to initials, then to a neutral glyph. */
		name?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		shape?: 'circle' | 'square';
		status?: 'online' | 'busy' | 'away' | 'offline';
		class?: string;
	}

	let { src, alt, name, size = 'md', shape = 'circle', status, class: className }: Props = $props();

	let failed = $state(false);

	const sizes = {
		xs: 'size-6 text-[0.625rem]',
		sm: 'size-8 text-xs',
		md: 'size-10 text-sm',
		lg: 'size-12 text-base',
		xl: 'size-16 text-xl'
	};

	const statusColors = {
		online: 'bg-success',
		busy: 'bg-danger',
		away: 'bg-warning',
		offline: 'bg-fg-subtle'
	};

	let initials = $derived(
		(name ?? '')
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('')
	);
</script>

<span class={cn('relative inline-flex shrink-0', className)}>
	<span
		class={cn(
			'flex items-center justify-center overflow-hidden border border-border bg-muted font-medium text-fg-muted select-none',
			shape === 'circle' ? 'rounded-full' : 'rounded-md',
			sizes[size]
		)}
	>
		{#if src && !failed}
			<img
				{src}
				alt={alt ?? name ?? ''}
				class="size-full object-cover"
				onerror={() => (failed = true)}
			/>
		{:else if initials}
			{initials}
		{:else}
			<svg viewBox="0 0 24 24" fill="none" class="size-[55%] opacity-60" aria-hidden="true">
				<circle cx="12" cy="8.5" r="3.5" fill="currentColor" />
				<path
					d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		{/if}
	</span>

	{#if status}
		<span
			class={cn(
				'absolute right-0 bottom-0 rounded-full border-2 border-bg',
				statusColors[status],
				size === 'xs' || size === 'sm' ? 'size-2.5' : 'size-3'
			)}
			aria-label={status}
		></span>
	{/if}
</span>
