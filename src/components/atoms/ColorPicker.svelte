<script lang="ts">
	export let color: string | undefined = undefined;
	export let onColorChange: (newColor: string) => void;

	$: {
		console.log('color in picker: ', color);
	}
</script>

<div>
	<label for="colorPicker" class="mb-2 block text-sm font-bold text-gray-700">
		Choose Color:
	</label>
	<input
		type="color"
		id="colorPicker"
		bind:value={color}
		on:input={(e) => onColorChange(e.currentTarget.value)}
		class="h-10 w-full border-0 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
	/>
</div>
