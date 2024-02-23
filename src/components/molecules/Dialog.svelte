<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		Dialog,
		DialogOverlay,
		DialogTitle,
		DialogDescription
	} from '@rgossiaux/svelte-headlessui';
	import Icon from '../../components/atoms/Icon.svelte';
	import { mdiDelete } from '@mdi/js';

	export let isOpen: boolean = false;

	let onlyTitle: boolean = (!$$slots.DialogDescription && !$$slots.DialogContent) ?? true;

	const dispatch = createEventDispatcher();
	const handleKeydown = (event: CustomEvent) => {
		dispatch('keydown', event);
	};

	const closeDialog = () => {
		isOpen = false;
		dispatch('close');
	};
</script>

<Dialog
	open={isOpen}
	on:close={closeDialog}
	class="fixed inset-0 z-10 overflow-y-auto"
	on:keydown={handleKeydown}
>
	<DialogOverlay class="fixed inset-0 bg-black bg-opacity-50" />

	<div class="flex min-h-full items-end justify-center p-4 py-8 sm:items-center">
		<div
			class="relative mx-auto max-w-md overflow-clip rounded-lg bg-white shadow-lg dark:bg-slate-800"
		>
			<div class="modal-body">
				<div
					class={`modal-header flex items-start justify-between gap-x-6 p-4 sm:p-4 ${onlyTitle ? '' : 'pb-0 sm:pb-0'}`}
				>
					<DialogTitle as="h6" class="text-xl font-semibold">
						<slot name="DialogTitle" />
					</DialogTitle>
					<button on:click={closeDialog} class="text-gray-400 hover:text-red-600">
						<Icon path={mdiDelete} class="mt-0.5 size-5" />

					</button>
				</div>
				{#if $$slots.DialogDescription || $$slots.DialogContent}
					<div class="modal-content mb-4 mt-2 flex flex-col gap-y-4 px-4 sm:px-6">
						{#if $$slots.DialogDescription}
							<DialogDescription as="div">
								<slot name="DialogDescription" />
							</DialogDescription>
						{/if}
						<slot name="DialogContent" />
					</div>
				{/if}
				{#if $$slots.DialogFooter}
					<div
						class="modal-footer m:-mx-6 flex gap-x-4 gap-y-2 bg-slate-50 px-4 sm:flex-row-reverse sm:px-6 sm:py-4 dark:bg-slate-900"
					>
						<slot name="DialogFooter" />
					</div>
				{/if}
			</div>
		</div>
	</div>
</Dialog>
