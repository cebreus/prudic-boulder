<script lang="ts">
	import { addToast } from '../../utils/ToastService';
	import { clickedGrips, selector, boulders } from '../../stores/BoulderStore.svelte';
	import { hexToRgba } from '../../utils/utils';
	import Boulder from '../atoms/Boulder.svelte';
	import BoulderButtons from '../molecules/BoulderButtons.svelte';
	import BrightnessSlider from '../molecules/BrightnessSlider.svelte';
	import Button from '../atoms/Button.svelte';
	import ColorPicker from '../molecules/ColorPicker.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import log from '../../utils/logger';
	import Toast from '../atoms/Toast.svelte';

	let inputBoulderName: string = '';

	let currentColor: string | undefined;
	let displayColor: string | undefined;
	let brightness: number;

	$: displayColor = hexToRgba(currentColor, brightness);

	const handleColorChange = (newColor: string) => {
		currentColor = newColor;
	};

	const handleSaveBoulder = () => {
		log.debug('handleSaveBoulder()');
		if ($clickedGrips.size === 0) {
			log.trace('Pick at least one grip');
			addToast('Vyberte alespoň jednu buňku!');
			return;
		}
		window.dispatchEvent(new CustomEvent('dialog-opened', { detail: { dialogId: 'dialog' } }));
		log.info('Dialog opened');
	};

	const handleDialogResponse = async () => {
		log.debug('handleDialogResponse()');
		const trimmedInputBoulderName = inputBoulderName.trim();
		await boulders.addBoulder($clickedGrips, $selector, trimmedInputBoulderName, 'save');
		window.dispatchEvent(new CustomEvent('dialog-closed', { detail: { dialogId: 'dialog' } }));
	};

	const handleBrightnessChange = (newBrightness: number) => {
		brightness = newBrightness;
	};

	const handleRefreshButton = () => {
		displayColor = undefined;
	};
</script>

<main class="container mx-auto px-4 py-12">
	<h1 class="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
		Vytvoř si vlasrní cesty a obrázky na boulderu
	</h1>
	<div class="mt-5 flex-col">
		<Boulder color={displayColor} />
		<BoulderButtons {handleSaveBoulder} />

		<div class="mt-5 grid w-[20.8em] justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
			<div class="mb-4">
				<ColorPicker color={displayColor} onColorChange={handleColorChange} {handleRefreshButton} />
			</div>
			<div class="mb-6">
				<BrightnessSlider {brightness} onBrightnessChange={handleBrightnessChange} />
			</div>
		</div>
	</div>
</main>

<Toast />

<Dialog {handleDialogResponse} dialogId="dialog">
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
