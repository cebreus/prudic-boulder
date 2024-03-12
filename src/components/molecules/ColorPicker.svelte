<script lang="ts">
	export let color: string | undefined = undefined;
	export let onColorChange: (newColor: string) => void;

	$: bindColor = rgbaToHex(color);
</script>

	<label for="colorPicker" class="mb-2 block text-sm font-bold text-gray-700">
		Choose Color:
	</label>
	<input
		type="color"
		id="colorPicker"
		bind:value={bindColor}
		on:input={(e) => onColorChange(e.currentTarget.value)}
		class="h-10 w-full border-0 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
	/>
	<div class="flex items-end">
		<Button variant="outline" on:click={() => handleRefreshButton()}>
			<Icon path={mdiRefresh} class="size-4" />
		</Button>
	</div>
