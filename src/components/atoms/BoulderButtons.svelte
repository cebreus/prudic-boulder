<script lang="ts">
	import { clickedCells, selector } from '../../stores/BoulderStore.svelte';
	import Button from './Button.svelte';

	export const variant: 'default' | 'play' = 'default';
	export let handleSaveBoulder: () => void;
</script>

{#if variant === 'default'}
	<div class="grid w-[20.8em] grid-flow-col justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
		<Button variant="outline" on:click={() => selector.setMode('Start')}>Start</Button>
		<Button variant="outline" on:click={() => selector.setMode('Top')}>Top</Button>
		<Button emoji="💾" variant="outlineGreen" aria-label="Save" on:click={handleSaveBoulder}
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
{/if}
