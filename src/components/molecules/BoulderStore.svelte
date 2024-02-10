<script context="module">
	import { derived, writable } from 'svelte/store';

	export const clickedCells = writable(new Set());

	export const boulders = writable([]);

	export const clickedCellsArray = derived(clickedCells, ($clickedCellsSet) =>
		Array.from($clickedCellsSet)
	);

	export const selector = writable({
		selectingMode: null,
		selectedStartCell: null,
		selectedTopCell: null
	});
</script>
