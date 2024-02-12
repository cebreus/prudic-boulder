<script context="module">
	import { writable } from 'svelte/store';

	export const clickedCells = writable(new Set());

	export const boulders = writable([]);

	export const selector = writable({
		selectingMode: null,
		selectedStartCell: null,
		selectedTopCell: null
	});
</script>
