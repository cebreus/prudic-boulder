<script>
	export let width = 116;
	export let height = 30;
	export let viewBox = `0 0 ${width} ${height}`;
	export let color = 'currentColor';
	export let strokeWidth = 0;
	export let fill = '';
	export let ariaLabel = '';
	export let ariaHidden = false;
	export let title = 'Home Boulder Wall';
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

	<path
		fill-rule="evenodd"
		fill={color}
		d="m15.3 9.3l10.8 1.6-11.2 3.9-1.1 12.3-5-10.2-8.8 3.2 6.7-7.4-2.6-4.9 6.3 0.9 5.6-6.2zm-5 4.4l2.1 3.6 0.5-4.5 4.7-1.7-4.4-0.7 0.5-3.6-2.8 3.2-3.4-0.6 1.6 2.5-3 3.4zm26.3-13.7h1.8v6.9h-1.8v-2.7h-2.5v2.7h-1.8v-6.9h1.8v2.7h2.5zm8.2 0l1 1v4.8l-1 1.1h-4l-1.1-1.1v-4.8l1.1-1zm-3.3 5.3h2.5v-3.8h-2.5zm10.8-5.3h1.8v6.8h-1.8v-3.8l-1.2 2.3h-0.9l-1.2-2.3v3.8h-1.8v-6.8h1.8l1.6 3.1zm9 1.5h-4v1.1h3.5v1.6h-3.5v1.1h4v1.5h-4.8l-1-1v-5.8h5.8zm11-0.5v1.7l-0.7 0.7 0.7 0.7v1.7l-1 1h-5.2v-6.8h5.2zm-4.4 1.6h2.6v-1.1h-2.6zm0 2.6h2.6v-1.1h-2.6zm10.8-5.4l1 1v4.8l-1 1.1h-4l-1-1.1v-4.8l1-1zm-3.2 5.4h2.5v-3.9h-2.5zm5.6 0.5v-5.8h1.8v5.3h2.5v-5.3h1.8v5.8l-1.1 1h-3.9zm7.4 0v-5.8h1.8v5.4h3.7v1.5h-4.5zm11.6-5.9l1 1.1v4.8l-1 1h-5v-6.9zm-3.3 5.4h2.5v-3.9h-2.5zm11.5-3.8h-4v1.2h3.5v1.5h-3.5v1.1h4v1.5h-4.8l-1-1v-5.8h5.8zm7.6-0.5v2.4l-1 1 1 1.6v0.8h-1.7l-1.4-2.3h-1.3v2.3h-1.8v-6.8h5.2zm-4.4 2h2.6v-1.5h-2.6zm-59.5 7.1h4.7v2.4l-4.8 17.4h-4.8l-2.6-9.3-2.6 9.3h-4.7l-4.9-17.4v-2.4h4.8l2.9 11.7 2.8-11.7h3.4l2.9 11.7zm7.7 19.8v-16.8l3-3h11.5l3 3v16.8h-5.2v-5.5h-7.1v5.5zm5.2-9.9h7.1v-5.5h-7.1zm16.3 6.9v-16.8h5.1v15.4h10.8v4.4h-12.9zm18.8 0v-16.9h5.2v15.5h10.7v4.3h-12.9z"
	/>
</svg>

<!-- <svg xmlns="http://www.w3.org/2000/svg" width="116" height="30" version="1.2"><style>.a{fill:#111}</style><path fill-rule="evenodd" d="m15.3 9.3 10.8 1.6-11.2 3.9-1.1 12.3-5-10.2L0 20.1l6.7-7.4-2.6-4.9 6.3.9L16 2.5zm-5 4.4 2.1 3.6.5-4.5 4.7-1.7-4.4-.7.5-3.6-2.8 3.2-3.4-.6 1.6 2.5-3 3.4zM36.6 0h1.8v6.9h-1.8V4.2h-2.5v2.7h-1.8V0h1.8v2.7h2.5V0zm8.2 0 1 1v4.8l-1 1.1h-4l-1.1-1.1V1l1.1-1zm-3.3 5.3H44V1.5h-2.5zM52.3 0h1.8v6.8h-1.8V3l-1.2 2.3h-.9L49 3v3.8h-1.8V0H49l1.6 3.1zm9 1.5h-4v1.1h3.5v1.6h-3.5v1.1h4v1.5h-4.8l-1-1V0h5.8v1.5zm11-.5v1.7l-.7.7.7.7v1.7l-1 1h-5.2V0h5.2zm-4.4 1.6h2.6V1.5h-2.6zm0 2.6h2.6V4.1h-2.6zM78.7-.2l1 1v4.8l-1 1.1h-4l-1-1.1V.8l1-1zm-3.2 5.4H78V1.3h-2.5zm5.6.5V-.1h1.8v5.3h2.5V-.1h1.8v5.8l-1.1 1h-3.9zm7.4 0V-.1h1.8v5.4H94v1.5h-4.5zm11.6-5.9 1 1.1v4.8l-1 1h-5V-.2h5zm-3.3 5.4h2.5V1.3h-2.5zm11.5-3.8h-4v1.2h3.5v1.5h-3.5v1.1h4v1.5h-4.8l-1-1V-.1h5.8v1.5zm7.6-.5v2.4l-1 1 1 1.6v.8h-1.7l-1.4-2.3h-1.3v2.3h-1.8V-.1h5.2zm-4.4 2h2.6V1.4h-2.6zM52 10h4.7v2.4l-4.8 17.4h-4.8l-2.6-9.3-2.6 9.3h-4.7l-4.9-17.4V10h4.8L40 21.7 42.8 10h3.4l2.9 11.7zm7.7 19.8V13l3-3h11.5l3 3v16.8H72v-5.5h-7.1v5.5h-5.2zm5.2-9.9H72v-5.5h-7.1zm16.3 6.9V10h5.1v15.4h10.8v4.4H84.2zm18.8 0V9.9h5.2v15.5h10.7v4.3H103z" class="a"/></svg> -->
