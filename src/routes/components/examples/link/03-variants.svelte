<!-- Muted and inherited colors for places where an accent-colored link would shout, like a footer. -->
<script lang="ts">
	import { Link } from '@joshicodes/cock';
</script>

<footer
	class="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-fg-muted"
>
	<span>
		© The Coop. Made by
		<Link href="https://github.com/JoshiCodes" variant="inherit">JoshiCodes</Link>.
	</span>
	<nav class="flex gap-4">
		<Link href="/docs/getting-started" variant="muted" underline="hover">Docs</Link>
		<Link href="/components" variant="muted" underline="hover">Components</Link>
		<Link href="/themes" variant="muted" underline="hover">Themes</Link>
	</nav>
</footer>
