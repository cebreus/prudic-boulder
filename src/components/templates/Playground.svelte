<script lang="ts">
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
	import Boulder from '../atoms/Boulder.svelte';
	import Toast from '../atoms/Toast.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Button from '../atoms/Button.svelte';
	import log from '../utils/logger.ts';
	import { clickedGrips, selector, boulders } from '../../stores/BoulderStore.svelte';
	import { adjustColor } from '../utils/utils.ts';
	import ColorPicker from '../atoms/ColorPicker.svelte';
	import BrightnessSlider from '../atoms/BrightnessSlider.svelte';

	let isOpen: boolean = false;
	let inputBoulderName: string;

	let initialColor = '#FF0000';
	let color: string | undefined = '#FF0000';
	let brightness = 100;

	$: color = adjustColor(initialColor, brightness);
	$: if (!isOpen) {
		inputBoulderName = '';
	}

	const handleColorChange = (newColor: string) => {
		initialColor = newColor;
	};

	const handleSaveBoulder = () => {
		log.debug('handleSaveBoulder()');
		if ($clickedGrips.size > 0) {
			isOpen = true;
			log.info('Dialog opened');
		}
	};

	const handleDialogResponse = () => {
		log.debug('handleDialogResponse()');
		isOpen = false;
		const trimmedInputBoulderName = inputBoulderName.trim();
		boulders.addBoulder($clickedGrips, $selector, trimmedInputBoulderName, 'save');
	};

	const handleKeyDown = (event: CustomEvent) => {
		const keyboardEvent = event.detail as KeyboardEvent;
		if (keyboardEvent.key === 'Enter') {
			handleDialogResponse();
			keyboardEvent.preventDefault();
			keyboardEvent.stopPropagation();
		}
	};

	const handleBrightnessChange = (newBrightness: number) => {
		brightness = newBrightness;
	};
</script>

<div class="mt-5 flex-col">
	<Boulder {color} />
	<BoulderButtons {handleSaveBoulder} />

	<div class="max-w-sm rounded-lg bg-white p-6 shadow-lg">
		<div class="mb-4">
			<ColorPicker {color} onColorChange={handleColorChange} />
		</div>

		<div class="mb-6">
			<BrightnessSlider {brightness} onBrightnessChange={handleBrightnessChange} />
		</div>
	</div>
</div>

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
