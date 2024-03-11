<script lang="ts">
	import type { Boulder } from '../utils/BoulderTypes.ts';
	import { mdiFileExportOutline } from '@mdi/js';
	import Icon from './Icon.svelte';

	export let boulder: Boulder;

	export const exportToJsonFile = (boulderData: Boulder) => {
		const jsonString = JSON.stringify(boulderData);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = `boulder-${boulderData.id}.json`;
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
</script>

<button on:click={() => exportToJsonFile(boulder)}>
	<Icon
		path={mdiFileExportOutline}
		class="size-4 text-sky-500 transition-colors hover:text-sky-700"
	/>
</button>
