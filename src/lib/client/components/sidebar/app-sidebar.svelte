<script lang="ts" module>
	import ArchiveX from 'lucide-svelte/icons/archive-x';
	import File from 'lucide-svelte/icons/file';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Send from 'lucide-svelte/icons/send';
	import Trash2 from 'lucide-svelte/icons/trash-2';

	// This is sample data
	const data = {
		user: {
			name: 'shadcn',
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		navMain: [
			{
				title: 'Inbox',
				url: '#',
				icon: Inbox,
				isActive: true
			},
			{
				title: 'Drafts',
				url: '#',
				icon: File,
				isActive: false
			},
			{
				title: 'Sent',
				url: '#',
				icon: Send,
				isActive: false
			},
			{
				title: 'Junk',
				url: '#',
				icon: ArchiveX,
				isActive: false
			},
			{
				title: 'Trash',
				url: '#',
				icon: Trash2,
				isActive: false
			}
		],
		mails: [
			{
				name: 'William Smith',
				email: 'williamsmith@example.com',
				subject: 'Meeting Tomorrow',
				date: '09:34 AM',
				teaser:
					'Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.'
			}
		]
	};
</script>

<script lang="ts">
	import NavUser from '$lib/client/components/sidebar/nav-user.svelte';
	import { Label } from '$lib/client/components/ui/label/index';
	import * as Sidebar from '$lib/client/components/ui/sidebar/index';
	import { useSidebar } from '$lib/client/components/ui/sidebar/index';
	import { Switch } from '$lib/client/components/ui/switch/index';
	import Command from 'lucide-svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	// import type { Ticket } from '$lib/server/db/schema';
	import { formatDate } from '$lib/utils';

	let {
		ref = $bindable(null),
		tickets,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		tickets: any[];
	} = $props();

	let activeItem = $state(data.navMain[0]);
	let mails = $state(data.mails);
	const sidebar = useSidebar();
</script>

<Sidebar.Root
	bind:ref
	collapsible="icon"
	class="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
	{...restProps}
>
	<!-- This is the first sidebar -->
	<!-- We disable collapsible and adjust width to icon. -->
	<!-- This will make the sidebar appear as icons. -->
	<Sidebar.Root
		collapsible="none"
		class="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
	>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg" class="md:h-8 md:p-0">
						{#snippet child({ props })}
							<a href="##" {...props}>
								<div
									class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
								>
									<Command class="size-4" />
								</div>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-semibold">Acme Inc</span>
									<span class="truncate text-xs">Enterprise</span>
								</div>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent class="px-1.5 md:px-0">
					<Sidebar.Menu>
						{#each data.navMain as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									tooltipContentProps={{
										hidden: false
									}}
									onclick={() => {
										activeItem = item;
										const mail = data.mails.sort(() => Math.random() - 0.5);
										mails = mail.slice(
											0,
											Math.max(5, Math.floor(Math.random() * 10) + 1)
										);
										sidebar.setOpen(true);
									}}
									isActive={activeItem.title === item.title}
									class="px-2.5 md:px-2"
								>
									{#snippet tooltipContent()}
										{item.title}
									{/snippet}
									<item.icon />
									<span>{item.title}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Footer>
			<NavUser user={data.user} />
		</Sidebar.Footer>
	</Sidebar.Root>

	<!-- This is the second sidebar -->
	<!-- We disable collapsible and let it fill remaining space -->
	<Sidebar.Root collapsible="none" class="hidden flex-1 md:flex">
		<Sidebar.Header class="gap-3.5 border-b p-4">
			<div class="flex w-full items-center justify-between">
				<div class="text-foreground text-base font-medium">
					{activeItem.title}
				</div>
				<Label class="flex items-center gap-2 text-sm">
					<span>Unreads</span>
					<Switch class="shadow-none" />
				</Label>
			</div>
			<Sidebar.Input placeholder="Type to search..." />
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group class="px-0">
				<Sidebar.GroupContent>
					{#each tickets as ticket}
						<a
							href="/tickets/{ticket.id}"
							class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0"
						>
							<div class="flex w-full items-center gap-2">
								<span>{ticket.subject}</span>{' '}
								<span class="ml-auto text-xs"
									>{formatDate(ticket.created_at)}</span
								>
							</div>
							<span class="font-medium">{ticket.subject}</span>
							<span
								class="line-clamp-2 w-[260px] whitespace-break-spaces text-xs"
							>
								{ticket.lastMessage}
							</span>
						</a>
					{/each}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Root>
