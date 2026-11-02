<!-- Drag a line, or tab to it and use the arrow keys. Groups nest, so the right side splits the other way. -->
<script lang="ts">
	import { Resizable, ResizableHandle, ResizablePanel } from '@joshicodes/cock';

	const files = ['cock.config.ts', 'coop/', 'eggs.svelte', 'rooster.svelte', 'perch.ts'];
</script>

<div class="h-80 w-full overflow-hidden rounded-lg border border-border bg-surface">
	<Resizable>
		<ResizablePanel size={26} min={15} max={45}>
			<ul class="space-y-0.5 p-3 font-mono text-[0.8125rem]">
				{#each files as file (file)}
					<li
						class={file === 'eggs.svelte'
							? 'rounded bg-muted px-2 py-1 text-fg'
							: 'px-2 py-1 text-fg-muted'}
					>
						{file}
					</li>
				{/each}
			</ul>
		</ResizablePanel>

		<ResizableHandle />

		<ResizablePanel>
			<Resizable direction="vertical">
				<ResizablePanel size={65} min={25}>
					<pre class="p-4 font-mono text-[0.8125rem] leading-relaxed text-fg-muted"><span
							class="text-fg">let</span
						> eggs = $state(0);

<span class="text-fg">function</span> lay() &#123;
	eggs += 1; <span class="text-fg-subtle">// she did all the work</span>
&#125;</pre>
				</ResizablePanel>

				<ResizableHandle grip />

				<ResizablePanel min={15}>
					<div class="h-full bg-muted/50 p-4 font-mono text-[0.8125rem] text-fg-muted">
						<p><span class="text-accent">$</span> bun run dev</p>
						<p>Laid 1 egg in 412 ms. Not bad for a first time.</p>
					</div>
				</ResizablePanel>
			</Resizable>
		</ResizablePanel>
	</Resizable>
</div>
