<script lang="ts">
	import { clickedGrips, selector } from '../../stores/BoulderStore.svelte';
	import Button from '../atoms/Button.svelte';

	export const variant: 'default' | 'play' = 'default';
	export let handleSaveBoulder: () => void;
	export let handleDisplayBoulder: () => void;
</script>

{#if variant === 'default'}
	<div class="grid w-[20.8em] grid-flow-col justify-stretch gap-4 pl-9 pr-1 pt-4 sm:w-[23.5em]">
		<Button variant="outline" on:click={() => selector.setMode('Start')}>Start</Button>
		<Button variant="outline" on:click={() => selector.setMode('Finish')}>Finish</Button>
		<Button emoji="💾" variant="outlineGreen" aria-label="Save" on:click={handleSaveBoulder}
		></Button>
		<Button
			emoji="🗑️"
			variant="outlineYellow"
			aria-label="Clear"
			on:click={() => {
				clickedGrips.clear();
				selector.clear();
			}}
		></Button>

		<Button emoji="▶" variant="outline" on:click={handleDisplayBoulder}></Button>
	</div>
{/if}
