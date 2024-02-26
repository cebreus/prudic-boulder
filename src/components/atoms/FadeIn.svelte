<!-- FadeIn.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let visible = false;

	onMount(() => {
		visible = true;
	});
</script>

{#if visible}
	<div in:fade={{ duration: 300 }}>
		<slot />
	</div>
{/if}
