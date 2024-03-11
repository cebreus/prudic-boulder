<script lang="ts">
	import Boulder from '../atoms/Boulder.svelte';
	import Toast from '../atoms/Toast.svelte';
	import log from '../utils/logger.ts';
	import { clickedGrips, selector, boulders } from '../../stores/BoulderStore.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Button from '../atoms/Button.svelte';
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
	import { addToast } from '../utils/ToastService.ts';

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
		if ($clickedGrips.size > 0) {
			isOpen = true;
			currentAction = 'display';
			log.debug('isOpen = true, action = display');
		} else {
			addToast('Vyberte alespoň jednu buňku!');
		}
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

<Toast />

<Boulder />

<BoulderButtons {handleSaveBoulder} {handleDisplayBoulder} />

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
