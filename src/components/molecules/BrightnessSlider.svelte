<script lang="ts">
	export let brightness: number = 100;
	export let onBrightnessChange: (value: number) => void;
</script>

<label for="brightnessSlider" class="mb-3 block text-sm font-bold">
	Nastavte jas: {brightness}%
</label>
<input
	type="range"
	id="brightnessSlider"
	min="0"
	max="100"
	bind:value={brightness}
	on:input={(e) => onBrightnessChange(e.currentTarget.valueAsNumber)}
	class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-sky-400"
/>
