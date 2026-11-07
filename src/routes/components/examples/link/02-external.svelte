<!-- Absolute URLs open in a new tab and get an arrow. Screen readers hear that it opens a new tab. -->
<script lang="ts">
	import { Link } from '@joshicodes/cock';
</script>

<div class="flex flex-col gap-2 text-sm">
	<Link href="https://github.com/JoshiCodes/cock">Source on GitHub</Link>
	<Link href="https://cock.joshicodes.de/docs/theming" external={false}>Theming, same site</Link>
	<Link href="/llms.txt" external>llms.txt, in a new tab</Link>
</div>
