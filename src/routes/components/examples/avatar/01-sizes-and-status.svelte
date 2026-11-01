<!-- Initials come from name; the glyph is the fallback when there is neither. -->
<script lang="ts">
	import { Avatar } from '@joshicodes/cock';
</script>

<div class="flex flex-wrap items-center gap-3">
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
</div>
