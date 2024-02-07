<script>
	import { boulders } from '../molecules/BoulderStore.svelte';
	import Modal from './Modal.svelte';

	let showModal = false;
	let selectedBoulder = null;

	const handleModalClose = () => {
		showModal = false;
		selectedBoulder = null;
	};


	const removeBoulder = (boulderId) => {
		boulders.update((prevBoulders) => {
			const newBoulders = prevBoulders.filter((boulder) => boulder.id !== boulderId);
			localStorage.setItem('boulders', JSON.stringify(newBoulders));
			return newBoulders;
		});
	};

</script>

<!-- TODO: @artem Click on the ID should open modal with visualisation on a boulder -->

{#if $boulders?.length > 0}
	<div id="table-container" class="overflow-x-auto">
		<table id="dataTable" class="w-full text-left text-sm">
			<thead class="bg-slate-50 text-xs uppercase text-slate-500">
				<tr class="border-b bg-white">
					<th class="px-3 py-3 lg:px-6 lg:py-3">ID</th>
					<th class="px-3 py-3 lg:px-6 lg:py-3">Cells</th>
				</tr>
			</thead>
			<tbody>
				{#each $boulders as boulder (boulder.id)}
					<tr>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">
							<button on:click={() => { showModal = true; selectedBoulder = boulder; }}>
								{boulder.id}
							</button>
						</td>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.clickedCells}</td>
						<button on:click={() => removeBoulder(boulder.id)}>❌</button>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
<!--{:else}-->
<!--	&lt;!&ndash; TODO: @artem create new component `atoms/Alert.svelte` &ndash;&gt;-->
<!--	&lt;!&ndash; TODO> @strem  message id OK? What if I haven't no boulders created? &ndash;&gt;-->
<!--	<div class="alert">No boulders loaded. Please refresh the page.</div>-->
<!--{/if}-->
	<Modal boulder={selectedBoulder} bind:showModal={showModal} on:close={handleModalClose} />

{#if $boulders?.length === 0}
	<div class="alert">No boulders loaded. Please refresh the page.</div>
{/if}