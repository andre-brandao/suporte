<script lang="ts">
	/** @type {{ data: import('./$types').PageData }} */
	import * as Select from '$lib/client/components/ui/select/index.js';
	import { Input } from '$lib/client/components/ui/input/index.js';
	import { Label } from '$lib/client/components/ui/label/index.js';
	import { Textarea } from '$lib/client/components/ui/textarea/index.js';
	import { Button } from '$lib/client/components/ui/button/index.js';
	import * as Card from '$lib/client/components/ui/card/index.js';
	import * as Accordion from '$lib/client/components/ui/accordion/index.js';
	import { trpc } from '$lib/trpc/client.js';
	import { page } from '$app/stores';
	import { typeSubject } from '$lib/utils';
	let { data } = $props();
	let tags = data.tags;

	let form = {
		tags: [],
		lastMessage: '',
		description: ''
	};

	let selectedSubject = $state('');

	async function handleSubmit() {
		const resp = await trpc($page).ticket.create.mutate({
			subject: selectedSubject,
			tags: form.tags,
			lastMessage: form.description,
			description: form.description
		});
	}

	const triggerContent = $derived(
		typeSubject.find((f) => f === selectedSubject) ?? 'Selecione'
	);
</script>

<main class="container mx-auto py-8">
	<div class="flex justify-between gap-3">
		<div class="w-1/3">
			<h2 class="text-2xl font-bold text-gray-900 mb-6">
				Frequently Asked Questions
			</h2>
			<Accordion.Root type="single">
				<Accordion.Item value="item-1">
					<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
					<Accordion.Content>
						Yes. It adheres to the WAI-ARIA design pattern.
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
		<Card.Root class=" w-2/3 shadow-lg">
			<Card.Header>
				<Card.Title class="text-2xl">Submit a Support Ticket</Card.Title>
				<Card.Description>
					We're here to help. Please fill out the form below.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<div class="space-y-6">
					<div class="grid w-full items-center gap-1.5">
						<Label for="picture">Selecione seu problema</Label>
						<Select.Root type="single" bind:value={selectedSubject}>
							<Select.Trigger>{triggerContent}</Select.Trigger>
							<Select.Content>
								{#each typeSubject as subject}
									<Select.Item value={subject} label={subject}
										>{subject}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="grid w-full gap-1.5">
						<Label for="message-2">Your Message</Label>
						<Textarea
							placeholder="Type your message here."
							id="message-2"
							bind:value={form.description}
						/>
						<p class="text-muted-foreground text-sm">
							Your message will be copied to the support team.
						</p>
					</div>

					<div class="grid w-full items-center gap-1.5">
						<Label for="files">Files</Label>
						<Input id="files" type="file" />
					</div>

					<Button type="submit" class="w-full" onclick={handleSubmit}
						>Submit Ticket</Button
					>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</main>
