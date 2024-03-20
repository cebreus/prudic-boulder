<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { mdiClose } from '@mdi/js';
	import Icon from '../../components/atoms/Icon.svelte';
	import { fade } from 'svelte/transition';

	export let isOpen: boolean = false;
	const dispatch = createEventDispatcher();

	const closeDialog = () => {
		isOpen = false;
		dispatch('close');
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeDialog();
		}
		dispatch('keydown', event);
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	$: onlyTitle = !$$slots.DialogDescription && !$$slots.DialogContent;
</script>

{#if isOpen}
	<div class="fixed inset-0 z-10 overflow-y-auto" in:fade out:fade>
		<div
			class="fixed inset-0 bg-black bg-opacity-50"
			on:click={closeDialog}
			tabindex="0"
			role="button"
			on:keydown={handleKeydown}
		></div>
		<div class="flex min-h-full items-end justify-center p-4 py-8 sm:items-center">
			<div
				class="relative mx-auto max-w-md overflow-clip rounded-lg bg-white shadow-lg dark:bg-slate-800"
			>
				<div class="modal-body">
					<div
						class={`modal-header flex items-start justify-between gap-x-6 p-4 sm:p-4 ${onlyTitle ? '' : 'pb-0 sm:pb-0'}`}
					>
						<h6 class="text-xl font-semibold">
							<slot name="DialogTitle" />
						</h6>
						<button on:click={closeDialog} class="text-gray-400 hover:text-red-600">
							<Icon path={mdiClose} class="mt-0.5 size-6 transition-colors ease-in-out" />
						</button>
					</div>
					{#if $$slots.DialogDescription || $$slots.DialogContent}
						<div class="modal-content mb-4 mt-2 flex flex-col gap-y-4 px-4 sm:px-6">
							{#if $$slots.DialogDescription}
								<div>
									<slot name="DialogDescription" />
								</div>
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
	</div>
{/if}
