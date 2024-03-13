<script lang="ts">
	import { rgbaToHex } from '../utils/utils.ts';
	import Button from '../atoms/Button.svelte';
	import Icon from '../atoms/Icon.svelte';
	import { mdiRefresh } from '@mdi/js';

	export let color: string | undefined;
	export let onColorChange: (newColor: string) => void;
	export let handleRefreshButton: () => void;

	$: bindColor = rgbaToHex(color);
</script>

<label for="colorPicker" class="mb-2 block text-sm font-bold">Vyberte barvu</label>
<div class="flex items-center gap-4">
	<input
		type="color"
		id="colorPicker"
		bind:value={bindColor}
		on:input={(e) => onColorChange(e.currentTarget.value)}
		class="h-10 w-full rounded-md border-0 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
	/>
	<Button variant="outline" on:click={() => handleRefreshButton()}>
		<Icon path={mdiRefresh} class="size-4" />
	</Button>
</div>
