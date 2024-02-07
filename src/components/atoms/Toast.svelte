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
		return (
			{
				success: 'bg-green-500',
				error: 'bg-red-500',
				info: 'bg-blue-500'
			}[type] || 'bg-gray-500'
		);
	};
</script>

{#if toastsArray.length > 0}
	<section class="fixed right-5 top-5 z-50 w-80" transition:fade>
		{#each toastsArray as toast (toast.id)}
			<article
				class="{getTypeClass(
					toast.type
				)} mx-auto mb-2 flex justify-between space-x-2 rounded-lg p-3"
				role="alert"
			>
				<div>
					{#if toast.type === 'success'}
						<SuccessIcon class="h-5 w-5" />
					{:else if toast.type === 'error'}
						<ErrorIcon class="h-5 w-5" />
					{:else}
						<InfoIcon class="h-5 w-5" />
					{/if}
				</div>

				<div class="flex items-center space-x-2">
					<div>
						{toast.message}
					</div>

					{#if toast.dismissible}
						<button on:click={() => dismissToast(toast.id)}>
							<CloseIcon class="h-4 w-4" />
						</button>
					{/if}
				</div>
			</article>
		{/each}
	</section>
{/if}
