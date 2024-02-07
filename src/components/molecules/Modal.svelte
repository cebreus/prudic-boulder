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
	<div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center modal-overlay" role="button" tabindex="0" on:click={handleOverlayClick} on:keydown={handleKeyDown}>
		<div class="bg-white p-4 md:p-8 rounded-lg shadow-md relative">
			<button class="absolute top-2 right-2 text-red-500" on:click={closeModal}>❌</button>
			<div class="modal-content">
				<h2 class="text-2xl font-bold mb-4">Boulder path:</h2>
				<ul class="flex flex-wrap">
					{#each boulder.clickedCells as cell (cell)}
						{#if cell === boulder.pathStart}
							<li class={startClass + ' w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0'}>{cell}</li>
						{:else if cell === boulder.pathEnd}
							<li class={topClass + ' w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0'}>{cell}</li>
						{:else}
							<li class={baseClasses + ' w-1/2 md:w-1/4 lg:w-1/6 flex-shrink-0'}>{cell}</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</div>
{/if}

