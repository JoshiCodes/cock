<script lang="ts">
	import { Badge, Button, Scramble } from '@joshicodes/cock';

	const moods = ['Asleep', 'Waking', 'Crowing', 'Awake'];
	let mood = $state(0);
</script>

<div class="flex flex-wrap items-center gap-4">
	<Badge variant="accent" class="font-mono">
		<Scramble text={moods[mood]} duration={600} />
	</Badge>

	<Button size="sm" variant="outline" onclick={() => (mood = (mood + 1) % moods.length)}>
		Next
	</Button>

	<span class="text-sm text-fg-muted">
		<Scramble text="Hover this line. It likes the attention." trigger="hover" class="font-mono" />
	</span>
</div>
