<script>
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import SuccessIcon from '../utils/icons/SuccessIcon.svelte';
	import ErrorIcon from '../utils/icons/ErrorIcon.svelte';
	import InfoIcon from '../utils/icons/InfoIcon.svelte';
	import CloseIcon from '../utils/icons/CloseIcon.svelte';
	import { toasts, dismissToast } from '../utils/TostService.mjs';

	let toastsArray = [];

	const unsubscribe = toasts.subscribe(($toasts) => {
		toastsArray = $toasts;
	});

	onMount(() => {
		return () => {
			unsubscribe();
		};
	});

	onDestroy(unsubscribe);

	const getTypeClass = (type) => {
		return {
			success: 'bg-green-500',
			error: 'bg-red-500',
			info: 'bg-blue-500',
		}[type] || 'bg-gray-500';
	};

</script>

{#if toastsArray.length > 0}
	<section class="fixed top-5 right-5 w-80 z-50" transition:fade>
		{#each toastsArray as toast (toast.id)}
			<article class="{getTypeClass(toast.type)} rounded-lg p-3 flex justify-between mx-auto mb-2 space-x-2" role="alert">
				<div>
					{#if toast.type === 'success'}
						<SuccessIcon class="w-5 h-5" />
					{:else if toast.type === 'error'}
						<ErrorIcon class="w-5 h-5" />
					{:else}
						<InfoIcon class="w-5 h-5" />
					{/if}
				</div>

				<div class="flex items-center space-x-2">
					<div>
						{toast.message}
					</div>

					{#if toast.dismissible}
						<button on:click={() => dismissToast(toast.id)}>
							<CloseIcon class="w-4 h-4" />
						</button>
					{/if}
				</div>
			</article>

		{/each}
	</section>
{/if}
