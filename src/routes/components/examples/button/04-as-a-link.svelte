<!-- With href it renders an <a>, so middle-click and "open in new tab" work. -->
<script lang="ts">
	import { Button } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button href="/components/card">Next component</Button>
	<Button
		href="https://github.com/JoshiCodes/cock"
		target="_blank"
		rel="noreferrer"
		variant="outline"
	>
		Source on GitHub
	</Button>
	<Button block variant="soft">Full width</Button>
</div>
