<script lang="ts">
	import AppSidebar from '$lib/client/components/sidebar/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/client/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/client/components/ui/separator/index.js';
	import * as Sidebar from '$lib/client/components/ui/sidebar/index.js';
	import type { Ticket } from '$lib/server/db/schema';
	import type { Snippet } from 'svelte';

	let {
		children,
		tickets
	}: {
		children: Snippet;
		tickets: Ticket[];
	} = $props();
</script>

<Sidebar.Provider style="--sidebar-width: 350px;">
	<AppSidebar {tickets} />
	<Sidebar.Inset>
		<header
			class="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4"
		>
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#">All Inboxes</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Inbox</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<!-- <div class="flex flex-1 flex-col gap-4 p-4">
				{#each Array.from({ length: 24 }) as _, index (index)}
					<div class="bg-muted/50 aspect-video h-12 w-full rounded-lg"></div>
				{/each}
			</div> -->
		{@render children()}
	</Sidebar.Inset>
</Sidebar.Provider>
