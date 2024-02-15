<script>
	import { createEventDispatcher } from 'svelte';
	import { Dialog, DialogOverlay, DialogTitle } from '@rgossiaux/svelte-headlessui';
	import Icon from '../../icons/Icon.svelte';
	import Button from './Button.svelte';

	export let isOpen;
	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<Dialog open={isOpen} on:close={closeModal} class="fixed inset-0 z-10 overflow-y-auto">
	<DialogOverlay class="fixed inset-0 bg-black bg-opacity-50" />

	<div class="flex min-h-screen items-center justify-center">
		<div class="relative mx-auto w-full max-w-3xl rounded-lg bg-white shadow-lg">
			<button
				class="absolute right-0 top-0 m-4 text-gray-400 hover:text-gray-600"
				on:click={closeModal}
			>
				<Icon iconName="mdiClose" class="h-5 w-5" />
			</button>

			<div
				class="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-gray-100 px-6 py-4"
			>
				<DialogTitle class="text-xl font-semibold text-gray-700">Boulder name</DialogTitle>
			</div>

			<div class="flex justify-center p-6">
				<slot />
			</div>

			<div
				class="flex items-center justify-end rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-4"
			>
				<Button variant="outline" on:click={closeModal}>Cancel</Button>
			</div>
		</div>
	</div>
</Dialog>
