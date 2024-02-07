<script>
	export const baseClass = 'w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8';
	export const baseClasses = `${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600`;
	const startClass = `${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-yellow-300 hover:border-sky-400 hover:text-sky-600 bg-yellow-400 border-green-400 text-green-900`;
	const topClass = ` ${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-red-300 hover:border-sky-400 hover:text-sky-600 bg-red-400 border-red-400 text-red-900`;
	export let boulder = [];
	export let showModal = false;

	const closeModal = () => {
		showModal = false;
	};
	const handleOverlayClick = (event) => {
		if (event.target.classList.contains('modal-overlay')) {
			closeModal();
		}
	};
	const handleKeyDown = (event) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};
</script>

{#if showModal}
	<div
		class="modal-overlay fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
		role="button"
		tabindex="0"
		on:click={handleOverlayClick}
		on:keydown={handleKeyDown}
	>
		<div class="relative rounded-lg bg-white p-4 shadow-md md:p-8">
			<button class="absolute right-2 top-2 text-red-500" on:click={closeModal}>❌</button>
			<div class="modal-content">
				<h2 class="mb-4 text-2xl font-bold">Boulder path:</h2>
				<ul class="flex flex-wrap">
					{#each boulder.clickedCells as cell (cell)}
						{#if cell === boulder.pathStart}
							<li class={startClass + ' w-1/2 flex-shrink-0 md:w-1/4 lg:w-1/6'}>{cell}</li>
						{:else if cell === boulder.pathEnd}
							<li class={topClass + ' w-1/2 flex-shrink-0 md:w-1/4 lg:w-1/6'}>{cell}</li>
						{:else}
							<li class={baseClasses + ' w-1/2 flex-shrink-0 md:w-1/4 lg:w-1/6'}>{cell}</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}
