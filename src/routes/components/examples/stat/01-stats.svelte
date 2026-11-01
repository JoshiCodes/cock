<script lang="ts">
	import { Stat } from '@joshicodes/cock';
</script>

<div class="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<Stat label="Eggs this week" value="142" change="+12" trend="up" hint="vs last week" />
	<Stat label="Average weight" value="63 g" change="+2 g" trend="up" hint="above average" />
	<Stat label="Lost to foxes" value="1" change="+1" trend="down" hint="this month" />
	<Stat label="Water left" value="82%" change="0%" trend="flat" />
</div>
