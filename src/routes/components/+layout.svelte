<script lang="ts">
	import DocsShell from '../showcase/DocsShell.svelte';

	let { children } = $props();
</script>

<DocsShell>
	{@render children()}
</DocsShell>
