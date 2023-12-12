<script>
	export let size = '1em';
	export let width = size;
	export let height = size;
	export let viewBox = '0 0 24 24';
	export let color = 'currentColor';
	export let strokeWidth = '1.5';
	export let fill = 'transparent';
	export let ariaLabel = '';
	export let ariaHidden = false;
	export let title = 'menu-toggler';
	export let desc = '';
	export let id = '';

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
	stroke-width={strokeWidth}
	stroke-linecap="round"
	aria-label={ariaLabel}
	aria-hidden={ariaHidden ? 'true' : 'false'}
	xmlns="http://www.w3.org/2000/svg"
>
	{#if title}
		<title>{title}</title>
	{/if}
	{#if desc}
		<desc>{desc}</desc>
	{/if}
	<path d="M4.8,7.2L12,7.2L19.2,7.2M4.8,12L19.2,12M4.8,16.8L12,16.8L19.2,16.8">
		<animate
			dur="0.2s"
			attributeName="d"
			values="M4.8,7.2L12,7.2L19.2,7.2M4.8,12L19.2,12M4.8,16.8L12,16.8L19.2,16.8;M7.2,7.2L12,12L16.8,7.2M12,12L12,12M7.2,16.8L12,12L16.8,16.8"
			fill="freeze"
			begin="start.begin"
		></animate>
		<animate
			dur="0.2s"
			attributeName="d"
			values="M7.2,7.2L12,12L16.8,7.2M12,12L12,12M7.2,16.8L12,12L16.8,16.8;M4.8,7.2L12,7.2L19.2,7.2M4.8,12L19.2,12M4.8,16.8L12,16.8L19.2,16.8"
			fill="freeze"
			begin="reverse.begin"
		></animate>
	</path>
	<rect width="24" height="24" stroke="none">
		<animate id="reverse" dur="2s" attributeName="width" begin="click"></animate>
	</rect>
	<rect width="24" height="24" stroke="none">
		<animate id="start" dur="0.001s" attributeName="width" values="24;0" fill="freeze" begin="click"
		></animate>
		<animate dur="0.001s" attributeName="width" values="0;24" fill="freeze" begin="reverse.begin"
		></animate>
	</rect>
</svg>
