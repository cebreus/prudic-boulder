<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Dialog, DialogOverlay, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import Button from './Button.svelte';
	import Icon from '../../components/atoms/Icon.svelte';

	export let isOpen: boolean;
	export let type: 'basic' | 'prompt' = 'basic';
	export let title = '';
	export let body = '';

	// eslint-disable-next-line no-unused-vars
	export let response: (name: string) => void;

	let inputName: string = '';

	const dispatch = createEventDispatcher();
	const closeModal = () => {
		dispatch('close');
	};

	const submitResponse = () => {
		if (type === 'prompt') {
			response(inputName);
		}
	};

	$: if (!isOpen) {
		inputName = '';
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			submitResponse();
			setTimeout(closeModal, 0);
		}
	};
</script>

<Dialog
	open={isOpen}
	on:close={closeModal}
	class="fixed inset-0 z-10 overflow-y-auto"
	on:keydown={handleKeyDown}
>
	<DialogOverlay class="fixed inset-0 bg-black bg-opacity-50" />

	<div class="flex min-h-screen items-center justify-center">
		<div class="relative mx-auto w-full max-w-md rounded-lg bg-white shadow-lg">
			<button
				class="absolute right-0 top-0 m-4 text-gray-400 hover:text-gray-600"
				on:click={closeModal}
			>
				<Icon iconName="mdiClose" class="h-5 w-5" />
			</button>

			<div class="rounded-t-lg px-6 py-5">
				<DialogTitle class="text-xl font-semibold text-gray-700">{title}</DialogTitle>
			</div>

			<div class="p-5">
				<p>{body}</p>
				{#if type === 'basic'}
					<slot />
				{/if}
				{#if type === 'prompt'}
					<input
						type="text"
						class="mt-1 w-full rounded border p-3 hover:border-sky-600 focus:border-blue-700 focus:outline-none"
						placeholder="Enter Boulder Name"
						bind:value={inputName}
						on:keydown={handleKeyDown}
					/>
				{/if}
				<div class="mt-4 flex justify-end space-x-2">
					<Button variant="outline" on:click={closeModal}>Cancel</Button>
					{#if type === 'prompt'}
						<Button on:click={submitResponse}>Save</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</Dialog>
