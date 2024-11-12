<script lang="ts">
	/** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
	import SidebarPage from '$lib/client/components/sidebar/sidebar-page.svelte';
	let { children, data } = $props();
</script>

<SidebarPage tickets={data.tickets}>
	{@render children()}
</SidebarPage>
