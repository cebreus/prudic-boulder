<script>
	import { boulders } from './BoulderStore.svelte';
	import Modal from './Modal.svelte';
	import Toast from '../atoms/Toast.svelte';
	import { addToast } from '../utils/TostService.mjs';
	import { mdiClose } from '@mdi/js';
	import Icon from '../../icons/Icon.svelte';

	let showModal = false;
	let selectedBoulder = null;

	const handleModalClose = () => {
		showModal = false;
		selectedBoulder = null;
	};

	const removeBoulder = (boulderId) => {
		addToast('info', 'Prudič byl odstraněn');
		boulders.update((prevBoulders) => {
			const newBoulders = prevBoulders.filter((boulder) => boulder.id !== boulderId);
			localStorage.setItem('boulders', JSON.stringify(newBoulders));
			return newBoulders;
		});
	};
</script>

<Toast />

<div class="min-h-screen bg-white text-gray-800">
	{#if $boulders?.length > 0}
		<div id="table-container" class="overflow-x-auto m-8">
			<table id="dataTable" class="w-full text-left">
				<thead>
				<tr class="text-sm font-medium text-gray-500">
					<th class="px-4 py-2">ID</th>
					<th class="px-4 py-2">Cells</th>
					<th class="px-4 py-2">Actions</th>
				</tr>
				</thead>
				<tbody>
				{#each $boulders as boulder (boulder.id)}
					<tr class="border-b border-gray-100">
						<td class="px-4 py-2">
							<button
								class="text-blue-500 hover:underline"
								on:click={() => {
                    showModal = true;
                    selectedBoulder = boulder;
                  }}
							>
								{boulder.id}
							</button>
						</td>
						<td class="px-4 py-2">{boulder.clickedCells}</td>
						<td class="px-4 py-2">
							<button
								class="text-gray-400 hover:text-gray-500"
								on:click={() => removeBoulder(boulder.id)}
							>
								<Icon path={mdiClose} class="w-5 h-5"/>
							</button>
						</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="flex justify-center items-center h-full">
			<div class="text-center text-sm text-gray-500">No boulders loaded. Please refresh the page.</div>
		</div>
	{/if}
</div>
<!--{:else}-->
<!--	&lt;!&ndash; TODO: @artem create new component `atoms/Alert.svelte` &ndash;&gt;-->
<!--	&lt;!&ndash; TODO> @strem  message id OK? What if I haven't no boulders created? &ndash;&gt;-->
<!--	<div class="alert">No boulders loaded. Please refresh the page.</div>-->
<!--{/if}-->
<Modal boulder={selectedBoulder} bind:showModal on:close={handleModalClose} />

{#if $boulders?.length === 0}
	<div class="alert">No boulders loaded. Please refresh the page.</div>
{/if}
