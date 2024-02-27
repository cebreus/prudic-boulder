<script lang="ts">
	export let path: string;
	export let size: string = '1em';
	export let width: string = size;
	export let height: string = size;
	export let viewBox: string = '0 0 24 24';
	export let color: string = '';
	export let fill: string = 'currentColor';
	export let ariaLabel: string = 'ikona';
	export let ariaHidden: boolean = false;
	export let title: string = '';
	export let desc: string = '';
	export let id: string = '';

	let className = '';
	export { className as class };
</script>

<svg
	{id}
	class={className}
	{width}
	{height}
	{viewBox}
	{fill}
	stroke={color}
	aria-label={ariaLabel}
	aria-hidden={ariaHidden ? 'true' : 'false'}
	xmlns="http://www.w3.org/2000/svg"
>
	{#if title.length}
		<title>{title}</title>
	{/if}
	{#if desc.length}
		<desc>{desc}</desc>
	{/if}
	<path d={path} />
</svg>
