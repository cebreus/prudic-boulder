<script lang="ts">
	export let width: number = 116;
	export let height: number = 30;
	export let viewBox: string = `0 0 ${width} ${height}`;
	export let color: string = 'currentColor';
	export let strokeWidth: number = 0;
	export let fill: string = 'currentColor';
	export let ariaLabel = 'ikona';
	export let ariaHidden = false;
	export let title: string = 'Boulder Wall';
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
