<script lang="ts">
	import Button from './Button.svelte';
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { readFileContent } from '../utils/utils.ts';
	import log from 'loglevel';
	import Alert from './Alert.svelte';

	export let handleCloseDialog: () => void;
	let selectedFile: string = '';
	let shouldReplace: boolean = false;

	let isError: boolean = false;
	let errorMessage: string = '';

	const handleFileChange = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input?.files[0]) {
			try {
				selectedFile = await readFileContent(input?.files[0]);
			} catch (error) {
				log.error('Error processing file:', error);
				isError = true;
				errorMessage = `Chybné zpracování souboru: ${error instanceof Error ? error.message : String(error)}`;
			}
		}
	};

	const handleAddButton = async () => {
		if (!selectedFile) {
			isError = true;
			errorMessage = 'Obsah souboru není k dispozici';
			return;
		}

		boulders
			.importBoulder(selectedFile, shouldReplace, (msg) => {
				isError = true;
				errorMessage = msg;
			})
			.then(() => {
				handleCloseDialog();
			})
			.catch((error) => {
				console.error('Import failed with an unexpected error:', error);
			});
	};
</script>

<input type="file" accept=".json" on:change={handleFileChange} />

{#if isError}
	<Alert variant="error">
		{errorMessage}
	</Alert>
{/if}

<label for="addOption">
	<input
		type="checkbox"
		bind:checked={shouldReplace}
		on:click={() => (shouldReplace = !shouldReplace)}
	/>
	Nahradit celou tabulku novými daty
</label>

<Button on:click={handleAddButton} variant="outline">Přidat</Button>
