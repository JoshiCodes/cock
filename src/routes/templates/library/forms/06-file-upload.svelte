<!-- Drop files, watch them go up one by one, remove what you did not mean to add. The upload is simulated. -->
<script lang="ts" module>
	export const meta = {
		height: 600,
		options: [
			{ name: 'multiple', label: 'Several files', type: 'boolean', default: true },
			{ name: 'limit', label: 'Size limit (MB)', type: 'text', default: '25', placeholder: 'MB' }
		]
	};
</script>

<script lang="ts">
	import { Button, Card, FileDrop, Progress } from '@joshicodes/cock';

	let { multiple = true, limit = '25' }: { multiple?: boolean; limit?: string } = $props();

	interface Upload {
		file: File;
		progress: number;
		error?: string;
	}

	let uploads = $state<Upload[]>([]);
	let busy = $derived(uploads.some((upload) => upload.progress < 100 && !upload.error));

	const size = (bytes: number) =>
		bytes < 1024 * 1024
			? `${Math.max(1, Math.round(bytes / 1024))} kB`
			: `${(bytes / 1024 / 1024).toFixed(1)} MB`;

	function add(files: File[]) {
		const max = Number(limit) * 1024 * 1024;
		const added = files.map((file) =>
			file.size > max
				? { file, progress: 0, error: `Larger than ${limit} MB` }
				: { file, progress: 0 }
		);
		uploads = multiple ? [...uploads, ...added] : added.slice(0, 1);
		for (const upload of added) if (!upload.error) send(upload);
	}

	// Stands in for a real request; swap it for fetch with an upload progress handler.
	function send(upload: Upload) {
		const tick = setInterval(() => {
			const entry = uploads.find((item) => item.file === upload.file);
			if (!entry) return clearInterval(tick);
			entry.progress = Math.min(100, entry.progress + 8 + Math.random() * 18);
			if (entry.progress === 100) clearInterval(tick);
		}, 180);
	}
</script>

<section class="@container flex justify-center bg-muted px-5 py-12">
	<Card padding="lg" class="w-full max-w-xl">
		<h2 class="text-xl font-semibold tracking-tight text-fg">Upload documents</h2>
		<p class="mt-1 text-sm text-fg-muted">
			Contracts, invoices or anything else for this project. Up to {limit} MB per file.
		</p>

		<FileDrop {multiple} onselect={add} hint="PDF, images or office files" class="mt-6" />

		{#if uploads.length}
			<ul class="mt-6 space-y-3">
				{#each uploads as upload (upload.file.name + upload.file.lastModified)}
					<li class="rounded-md border border-border p-3">
						<div class="flex items-center gap-3 text-sm">
							<span class="min-w-0 flex-1 truncate font-medium text-fg">{upload.file.name}</span>
							<span class="text-xs text-fg-subtle tabular-nums">
								{upload.error ??
									(upload.progress < 100
										? `${Math.round(upload.progress)}%`
										: size(upload.file.size))}
							</span>
							<Button
								variant="ghost"
								size="sm"
								onclick={() => (uploads = uploads.filter((item) => item !== upload))}
							>
								Remove
							</Button>
						</div>
						{#if !upload.error}
							<Progress
								value={upload.progress}
								size="sm"
								variant={upload.progress === 100 ? 'success' : 'accent'}
								label="Uploading {upload.file.name}"
								class="mt-2"
							/>
						{:else}
							<p class="mt-1 text-xs text-danger">{upload.error}. Pick a smaller file.</p>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}

		<div class="mt-6 flex justify-end gap-2">
			<Button variant="ghost" onclick={() => (uploads = [])} disabled={!uploads.length}
				>Clear</Button
			>
			<Button disabled={!uploads.length || busy}>Attach to project</Button>
		</div>
	</Card>
</section>
