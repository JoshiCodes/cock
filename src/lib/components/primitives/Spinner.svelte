<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		label?: string;
	}

	let { size = 'md', class: className, label = 'Loading' }: Props = $props();

	const sizes = {
		sm: 'size-3.5 border-[1.5px]',
		md: 'size-4 border-2',
		lg: 'size-6 border-2'
	};
</script>

<span
	role="status"
	aria-label={label}
	class={cn(
		'inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent align-[-0.125em]',
		sizes[size],
		className
	)}
></span>
