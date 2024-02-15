<script>
	import Button from './Button.svelte';
	import { selector, boulders, clickedCells } from '../../stores/BoulderStore.svelte';
</script>

<div class="grid w-[20.8em] grid-flow-col justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
	<Button variant="outline" on:click={() => selector.setMode('Start')}>Start</Button>
	<Button variant="outline" on:click={() => selector.setMode('Top')}>Top</Button>
	<Button
		emoji="💾"
		variant="outlineGreen"
		aria-label="Save"
		on:click={() => boulders.addBoulder($clickedCells, $selector)}
	></Button>
	<Button
		emoji="🗑️"
		variant="outlineYellow"
		aria-label="Clear"
		on:click={() => {
			clickedCells.clear();
			selector.clear();
		}}
	></Button>
</div>
