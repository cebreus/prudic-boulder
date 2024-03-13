<script lang="ts">
	import { mdiFileExportOutline } from '@mdi/js';
	import Icon from './Icon.svelte';
	import Boulder from './Boulder.svelte';
	import { addToast } from '../utils/ToastService';
	import log from 'loglevel';

	const fetchAllBoulders = (): Boulder[] => {
		const bouldersJson = localStorage.getItem('boulders');
		if (bouldersJson) {
			const boulders = JSON.parse(bouldersJson);
			if (boulders.length === 0) {
				log.info('No boulders found');
				addToast('Nejsou bouldery', 'error');
				return [];
			}
			return boulders;
		} else {
			log.info('Boulders key not found in localStorage');
			addToast('Nejsou bouldery', 'error');
			return [];
		}
	};

	const exportAllToSingleJsonFile = () => {
		const allBoulders = fetchAllBoulders();
		const jsonString = JSON.stringify(allBoulders);
		const blob = new Blob([jsonString], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'all-boulders.json';
		link.href = url;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
</script>

<button
	on:click={exportAllToSingleJsonFile}
	class="focus:shadow-outline flex items-center justify-center rounded bg-sky-500 px-4 py-2 font-bold text-white transition duration-200 ease-in hover:bg-sky-600 focus:outline-none"
>
	<Icon
		path={mdiFileExportOutline}
		class="text-white-100 hover:text-white-300 -ml-1 mr-2 h-4 w-4 transition-colors"
	/>
	Exportovat
</button>
