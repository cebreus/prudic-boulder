<script>
	import { addToast } from '../utils/ToastService.ts';
	import { boulders } from './BoulderStore.svelte';
	import { Modal } from 'flowbite-svelte';
	import Alert from '../atoms/Alert.svelte';
	import Icon from '../../icons/Icon.svelte';
	import Toast from '../atoms/Toast.svelte';
	import Boulder from '../atoms/Boulder.svelte';
	import { onMount } from 'svelte';

	let bouldersFromLS = [];
	let selectedBoulder = [];
	let clickOutsideModal = false;

	onMount(() => {
		const storedBoulders = localStorage.getItem('boulders');
		if (storedBoulders) {
			bouldersFromLS = JSON.parse(storedBoulders);
		}
	});

	function openModal(boulder) {
		selectedBoulder = boulder;
		clickOutsideModal = true;
	}

	const removeBoulder = (boulderId) => {
		const newBoulders = bouldersFromLS.filter((boulder) => boulder.id !== boulderId);

		localStorage.setItem('boulders', JSON.stringify(newBoulders));
		bouldersFromLS = newBoulders;

		boulders.update(() => newBoulders);

		addToast('info', 'Prudič byl odstraněn');
	};
</script>

<Toast />

{#if bouldersFromLS?.length > 0}
	<div id="table-container" class="my-8 overflow-x-auto">
		<table id="dataTable">
			<thead>
				<tr>
					<th>ID</th>
					<th colspan="2">Cells</th>
				</tr>
			</thead>
			<tbody>
				{#each bouldersFromLS as boulder (boulder.id)}
					<tr>
						<td>
							<button on:click={() => openModal(boulder)}>
								{boulder.id}
							</button>
						</td>
						<td>{Array.from(boulder.clickedCells)}</td>
						<td>
							<button on:click={() => removeBoulder(boulder.id)}>
								<Icon iconName="mdiDelete" class="h-5 w-5 text-red-500" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<Alert showIcon>
		Vytvořte si
		<a href="/new-boulder" class="text-blue-600 underline hover:no-underline dark:text-blue-300"
			>novou cestu</a
		> na lezecké stěně.
	</Alert>
{/if}

{#if clickOutsideModal && selectedBoulder}
	<Modal title="Boulder preview" bind:open={clickOutsideModal} autoclose outsideclose>
		<Boulder {selectedBoulder} />
	</Modal>
{/if}

<style lang="postcss">
	table {
		@apply text-left text-sm;
	}
	table thead {
		@apply border-b bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-800;
	}
	table tbody tr {
		@apply border-b bg-white dark:border-slate-700 dark:bg-slate-900;
	}
	table tbody tr:hover {
		@apply outline-dotted outline-1 outline-slate-700 dark:outline-slate-500;
	}
	table th {
		@apply px-3 py-2 align-bottom dark:text-slate-300;
		text-wrap: balance;
	}
	table td {
		@apply px-3 py-2 tabular-nums lg:pr-8;
	}
	table td button {
		@apply text-sky-500 underline hover:no-underline dark:text-sky-500 dark:hover:text-sky-400;
	}
</style>
