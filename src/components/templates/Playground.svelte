<script lang="ts">
	import BoulderButtons from '../atoms/BoulderButtons.svelte';
	import Boulder from '../atoms/Boulder.svelte';

	let color = '#ff0000'; // Default color red
	let brightness = 100; // Default brightness level

	// Function to convert hex color to RGB
	interface RGB {
		r: number;
		g: number;
		b: number;
	}

	// Function to convert hex color to RGB
	function hexToRgb(hex: string): RGB {
		hex = hex.replace(/^#/, ''); // Remove the hash at the start if it's there
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 2), 16);
		const b = parseInt(hex.slice(4, 2), 16);
		return { r, g, b };
	}

	// Function to adjust visual color brightness (for display, not for server data)
	function adjustVisualColorBrightness({ r, g, b }: RGB, brightness: number): string {
		const factor = brightness / 100;
		const adjust = (c: number): number => Math.round(c * factor);
		r = adjust(r);
		g = adjust(g);
		b = adjust(b);
		return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
	}

	let adjustedColor: string = color; // Visual representation
	let colorDataForServer: string; // Data format for server

	// Reactive statements to adjust color and format data for the server
	$: {
		const { r, g, b } = hexToRgb(color);
		adjustedColor = adjustVisualColorBrightness({ r, g, b }, brightness);
		colorDataForServer = `${r} ${g} ${b} / ${brightness}%`;
		console.log('Visual Color:', adjustedColor);
		console.log('Color Data for Server:', colorDataForServer);
	}
</script>

<div class=" mt-5 flex-col">
	<!-- Внешний контейнер для выравнивания -->
	<Boulder />
	<BoulderButtons />

	<div class="max-w-sm rounded-lg bg-white p-6 shadow-lg">
		<!-- Контейнер для color picker сохраняется без изменений -->
		<div class="mb-4">
			<label for="colorPicker" class="mb-2 block text-sm font-bold text-gray-700"
				>Choose Color:</label
			>
			<input
				type="color"
				id="colorPicker"
				bind:value={color}
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

		<div class="flex items-center justify-between space-x-5">
			<span class="text-sm font-bold text-gray-700">Adjusted Color:</span>
			<div class="flex items-center">
				<div
					class="h-10 w-10 rounded-md border border-gray-300 shadow-sm"
					style="background: {adjustedColor};"
				></div>
				<span class="ml-2 font-mono text-sm">{adjustedColor}</span>
			</div>
		</div>
	</div>
</div>

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
