<script lang="ts">
	import Boulder from '../atoms/Boulder.svelte';
	import Toast from '../atoms/Toast.svelte';
	import log from '../utils/logger.ts';
	import { clickedCells, selector, boulders } from '../../stores/BoulderStore.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Button from '../atoms/Button.svelte';
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
	import { fade } from 'svelte/transition';

	let isOpen: boolean = false;
	let inputBoulderName: string;

	$: if (!isOpen) {
		inputBoulderName = '';
	}

	const handleSaveBoulder = () => {
		log.debug('handleSaveBoulder()');
		if ($clickedCells.size > 0) {
			isOpen = true;
			log.info('    isOpen = true');
		}
	};

	const handleDialogResponse = () => {
		log.debug('handleDialogResponse()');
		isOpen = false;
		const trimmedInputBoulderName = inputBoulderName.trim();
		boulders.addBoulder($clickedCells, $selector, trimmedInputBoulderName);
	};

	const handleKeyDown = (event: CustomEvent) => {
		const keyboardEvent = event.detail as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			handleDialogResponse();
			keyboardEvent.preventDefault();
			keyboardEvent.stopPropagation();
		}
	};
</script>

<Toast />

<main class="container mx-auto px-4 py-12">
	<h1 class="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Vytvoř si nový boulder</h1>
	<Boulder />
	<BoulderButtons {handleSaveBoulder} />
</main>

<Dialog {isOpen} on:close={() => (isOpen = false)} on:keydown={handleKeyDown}>
	<svelte:fragment slot="DialogTitle">Název boulderu</svelte:fragment>
	<svelte:fragment slot="DialogContent">
		<input
			type="text"
			required
			class="w-full rounded border p-3 hover:border-sky-600 focus:border-blue-700 focus:outline-none"
			placeholder="Enter Boulder Name"
			bind:value={inputBoulderName}
		/>
	</svelte:fragment>
	<svelte:fragment slot="DialogFooter">
		<Button
			class="inline-flex w-full justify-center rounded-md sm:w-auto"
			on:click={handleDialogResponse}>Save</Button
		>
	</svelte:fragment>
</Dialog>
