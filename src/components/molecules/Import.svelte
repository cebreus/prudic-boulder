<script lang="ts">
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { readFileContent } from '../utils/utils.ts';
	import log from 'loglevel';
	import Alert from '../atoms/Alert.svelte';

	export let registerAddBoulderFunction: (addBoulderFn: () => void) => void;

	let selectedFile: string = '';
	let shouldReplace: boolean = false;

	let isError: boolean = false;
	let errorMessage: string = '';

	const handleFileChange = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		isError = false;

		if (!input.files || input.files.length === 0) {
			return;
		}

		try {
			selectedFile = await readFileContent(input?.files[0]);
		} catch (error) {
			log.error('Error processing file:', error);
			isError = true;
			errorMessage = `Chybné zpracování souboru: ${error instanceof Error ? error.message : String(error)}`;
		}
	};

	const handleAddButton = async () => {
		if (!selectedFile) {
			isError = true;
			errorMessage = 'Obsah souboru není k dispozici';
			return;
		}

		try {
			await boulders.importBoulder(selectedFile, shouldReplace, (msg) => {
				isError = true;
				errorMessage = msg;
			});
		} catch (error) {
			console.error('Import failed with an unexpected error:', error);
		}
	};

	registerAddBoulderFunction(handleAddButton);
</script>

<div class="flex space-x-2">
	<input
		type="checkbox"
		bind:checked={shouldReplace}
		on:click={() => (shouldReplace = !shouldReplace)}
		id="replaceOption"
	/>
	<label for="replaceOption">Nahradit stávající data</label>
</div>

<label for="addFile">Nahrajte JSON soubor Input type file</label>
<input type="file" accept=".json" on:change={handleFileChange} id="addFile" />

{#if isError}
	<Alert variant="error" showIcon>
		{errorMessage}
	</Alert>
{/if}
