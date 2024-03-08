<script lang="ts">
	import Button from './Button.svelte';
	import { boulders } from '../../stores/BoulderStore.svelte';
	import { addToast } from '../utils/ToastService.ts';
	import { readFileContent } from '../utils/utils.ts';
	import log from 'loglevel';

	type Action = 'Add' | 'Replace';

	export let handleCloseDialog: () => void;
	let selectedFile: string = '';
	let action: Action = 'Add';

	const handleFileChange = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			try {
				selectedFile = await readFileContent(input.files[0]);
			} catch (error) {
				// Handle file reading, JSON parsing or data validation errors
				log.error('Error processing file:', error);
				addToast(
					`Chybné zpracování souboru: ${error instanceof Error ? error.message : String(error)}`,
					'error'
				);
			}
		}
	};

	const handleAction = async () => {
		if (selectedFile) {
			handleCloseDialog();
			await boulders.importBoulder(selectedFile, action);
		} else {
			addToast('Obsah souboru není k dispozici', 'error');
		}
	};
</script>

<input type="file" accept=".json" on:change={handleFileChange} />

{#if selectedFile}
	<label>
		<input type="radio" bind:group={action} value="add" />
		Přidat do stávajícího seznamu
	</label>

	<label>
		<input type="radio" bind:group={action} value="replace" />
		Nahrazení celé tabulky novými daty
	</label>
{/if}
<Button on:click={handleAction} variant="outline">Přidat</Button>
