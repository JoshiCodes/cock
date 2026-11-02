<!-- A plain ordered list underneath, so it reads in order without the dots and lines. -->
<script lang="ts">
	import { Timeline, TimelineItem } from '@joshicodes/cock';
</script>

<Timeline class="w-full max-w-md">
	<TimelineItem title="The rooster goes off" time="04:52" datetime="2026-11-02T04:52" tone="accent">
		Early, loud, and very proud of himself.
	</TimelineItem>
	<TimelineItem
		title="First egg of the day"
		time="06:10"
		datetime="2026-11-02T06:10"
		tone="success"
	>
		Mabel, as usual. She likes to finish first.
	</TimelineItem>
	<TimelineItem
		title="Gertrude goes broody"
		time="09:30"
		datetime="2026-11-02T09:30"
		tone="warning"
	>
		Sitting on nothing. Will not be moved. Do not try.
	</TimelineItem>
	<TimelineItem
		title="Fox spotted near the fence"
		time="13:05"
		datetime="2026-11-02T13:05"
		tone="danger"
	>
		Left after a firm talking-to from the rooster.
	</TimelineItem>
	<TimelineItem title="Everyone back on the perch" time="18:40" datetime="2026-11-02T18:40">
		Lights out. What happens on the perch stays on the perch.
	</TimelineItem>
</Timeline>
