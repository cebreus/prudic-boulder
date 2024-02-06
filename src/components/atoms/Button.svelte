<script>
	export let emoji = '';
	export let size = 'm';
	export let onClick = () => {};
</script>

<button
	class={`
    text-black bg-gray-100 rounded-md
    hover:bg-blue-300 hover:shadow-md transition-all
    focus:outline-none active:bg-blue-600 active:shadow-inner active:text-blue-300
    ${size === 'm' ? 'text-base px-4 py-2' : ''}
    ${size === 'l' ? 'text-lg px-6 py-3' : ''}
    ${size === 'xl' ? 'text-xl px-8 py-4' : ''}
  `}
	on:click={onClick}
>
	<span role="img" aria-label="emoji">{emoji}</span>
	<slot />
</button>

