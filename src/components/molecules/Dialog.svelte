<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Dialog, DialogOverlay } from '@rgossiaux/svelte-headlessui';
	import Icon from '../../components/atoms/Icon.svelte';

	export let isOpen: boolean = false;
	export let type: 'basic' | 'prompt' | 'withFooter' = 'basic';
	export let title = '';
	export let body = '';

	// eslint-disable-next-line no-unused-vars
	export let response: () => void;

	const dispatch = createEventDispatcher();
	function closeDialog() {
		dispatch('close');
	}

	function submitResponse() {
		if (type === 'prompt') {
			response();
		}
	}

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			submitResponse();
			setTimeout(closeDialog, 0);
		}
	}
</script>

<Dialog
	open={isOpen}
	on:close={closeDialog}
	class="fixed inset-0 z-10 overflow-y-auto"
	on:keydown={handleKeyDown}
>
	<DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

	<div class="flex min-h-full items-end justify-center p-4 py-8 sm:items-center">
		<div class=" _w-full relative mx-auto max-w-md overflow-clip rounded-lg bg-white shadow-lg">
			<div class="modal-content">
				<div class="modal-header flex items-start justify-between gap-x-6 px-4 pt-5 sm:p-6 sm:pb-0">
					{#if title}
						<h6 class="text-base font-semibold leading-6 text-gray-900">{title}</h6>
					{:else}
						<slot name="title" />
					{/if}
					<button class="text-gray-400 hover:text-red-600" on:click={closeDialog}>
						<Icon iconName="mdiClose" class="mt-0.5 h-5 w-5" />
					</button>
				</div>
				<div
					class={`modal-body px-4 py-5 sm:px-6 sm:py-6 ${type === 'basic' ? 'pb-6 sm:pb-8' : ''}`}
				>
					{#if body}
						{body}
					{:else}
						<slot name="body" />
					{/if}
				</div>
				{#if type === 'withFooter'}
					<div
						class="modal-footer flex flex-col gap-x-4 gap-y-2 bg-gray-50 px-4 py-3 sm:flex-row-reverse sm:px-6"
					>
						<slot name="footer" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</Dialog>
