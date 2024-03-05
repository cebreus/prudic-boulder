<script lang="ts">
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
	import Boulder from '../atoms/Boulder.svelte';
	import Toast from '../atoms/Toast.svelte';
	import Dialog from '../molecules/Dialog.svelte';
	import Button from '../atoms/Button.svelte';
	import log from '../utils/logger.ts';
	import { clickedCells, selector, boulders } from '../../stores/BoulderStore.svelte';

	let isOpen: boolean = false;
	let inputBoulderName: string;

	let initialColor = '#FF0000';
	let color = '#FF0000';
	let brightness = 100;

	interface RGB {
		r: number;
		g: number;
		b: number;
	}

	function hexToRgb(hex: string): RGB {
		hex = hex.replace(/^#/, '');
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return { r, g, b };
	}

	function adjustVisualColorBrightness({ r, g, b }: RGB, brightness: number): string {
		const factor = brightness / 100;
		const adjust = (c: number): number => Math.round(c * factor);
		r = adjust(r);
		g = adjust(g);
		b = adjust(b);
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	}

	let adjustedColor: string = color;
	let colorDataForServer: string;

	$: {
		const { r, g, b } = hexToRgb(initialColor);
		// adjustedColor = adjustVisualColorBrightness({ r, g, b }, brightness);
		color = adjustVisualColorBrightness({ r, g, b }, brightness);
		colorDataForServer = `${r} ${g} ${b} / ${brightness}%`;
		console.log('server data:', colorDataForServer);
	}

	function handleColorChange(newColor: string) {
		initialColor = newColor;
	}

	//

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

<div class="mt-5 flex-col">
	<Boulder {color} />
	<BoulderButtons {handleSaveBoulder} />

	<div class="max-w-sm rounded-lg bg-white p-6 shadow-lg">
		<div class="mb-4">
			<label for="colorPicker" class="mb-2 block text-sm font-bold text-gray-700"
				>Choose Color:</label
			>
			<input
				type="color"
				id="colorPicker"
				value={color}
				on:input={(e) => handleColorChange(e.currentTarget.value)}
				class="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
			/>
		</div>

		<div class="mb-6">
			<label for="brightnessSlider" class="mb-2 block text-sm font-bold text-gray-700"
				>Adjust Brightness: {brightness}%</label
			>
			<input
				type="range"
				id="brightnessSlider"
				min="0"
				max="100"
				bind:value={brightness}
				class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
			/>
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

<div class="flex justify-start">
	<div>
		<h1>Playground</h1>
		<pre class="my-5">
Contains the Boulder component, buttons and colour picker.

Buttons: 
- Finish" sets the end of the path
- Start" sets start of path
- Show" sends data to server, server lights up wall
- Clear" clears set data Boulder
- Save" send data to server

Colour picker: set colour, click on grip -> apply colour 
from colour picker to clicked table grip, change 
background colour to these grip.
		</pre>
	</div>
</div>
