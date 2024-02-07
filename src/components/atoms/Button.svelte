<script>
	export let emoji = '';
	export let size = 'm';
	export let onClick = () => {};
</script>

<button
	class={`
    rounded-md bg-gray-100 text-black
    transition-all hover:bg-blue-300 hover:shadow-md
    focus:outline-none active:bg-blue-600 active:text-blue-300 active:shadow-inner
    ${size === 'm' ? 'px-4 py-2 text-base' : ''}
    ${size === 'l' ? 'px-6 py-3 text-lg' : ''}
    ${size === 'xl' ? 'px-8 py-4 text-xl' : ''}
  `}
	on:click={onClick}
>
	<span role="img" aria-label="emoji">{emoji}</span>
	<slot />
</button>
