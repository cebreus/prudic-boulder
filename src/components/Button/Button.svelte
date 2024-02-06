<script>
	export let emoji = '';
	export let size = 'm';
	export let onClick = () => {};
</script>

<button class={`button-${size}`} on:click={onClick}>
	<span role="img" aria-label="emoji">{emoji}</span>
	<slot></slot>
</button>

<style>
    .button-m {
        font-size: 16px;
        padding: 8px;
    }

    .button-l {
        font-size: 20px;
        padding: 12px;
    }

    .button-xl {
        font-size: 24px;
        padding: 16px;
    }

    /* Add more styles as needed */
</style>
