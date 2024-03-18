<script lang="ts">
	import { addToast } from '../../utils/ToastService';
	import { clickedGrips, selector, boulders } from '../../stores/BoulderStore.svelte';
	import Boulder from '../atoms/Boulder.svelte';
	import BoulderButtons from '../molecules/BoulderButtons.svelte';
	import Button from '../atoms/Button.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import log from '../../utils/logger';
	import Toast from '../atoms/Toast.svelte';

	let isOpen: boolean = false;
	let inputBoulderName: string;

	let currentAction: 'save' | 'display' | undefined;

	$: if (!isOpen) {
		inputBoulderName = '';
	}

	const handleSaveBoulder = () => {
		log.debug('handleSaveBoulder()');
		if ($clickedGrips.size === 0) {
			addToast('Vyberte alespoň jednu buňku!');
			return;
		}
		isOpen = true;
		currentAction = 'save';
		log.info('isOpen = true, action = save');
	};

	const handleDisplayBoulder = () => {
		if ($clickedGrips.size === 0) {
			addToast('Vyberte alespoň jednu buňku!');
			return;
		}
		isOpen = true;
		currentAction = 'display';
		log.debug('isOpen = true, action = display');
	};

	const handleDialogResponse = () => {
		log.debug('handleDialogResponse()');
		isOpen = false;
		const trimmedInputBoulderName = inputBoulderName.trim();

		if (currentAction === 'save') {
			boulders.addBoulder($clickedGrips, $selector, trimmedInputBoulderName, 'save');
		} else if (currentAction === 'display') {
			boulders.addBoulder($clickedGrips, $selector, trimmedInputBoulderName, 'display');
		}
		currentAction = undefined;
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

<main class="container mx-auto px-4 py-12">
	<h1 class="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Vytvoř si nový boulder</h1>
	<div class="mt-5 flex-col">
		<Boulder />

		<BoulderButtons {handleSaveBoulder} {handleDisplayBoulder} />
	</div>
</main>

<Toast />

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
