<script>
	export let path;
	export let width = '1em';
	export let 	viewBox= "0 0 24 24"

	export let fill = 'currentColor';

	export let strokeColor = null;
	export let strokeWidth = 0;
	export let ariaLabel = null;
	export let id = null;


	let className = '';
	export { className as class };
</script>

<svg
	id={id}
	class={className}
	{width}
	{viewBox}
	fill='currentColor'
	stroke={strokeColor}
	stroke-width={strokeWidth}
	aria-label={ariaLabel}
	xmlns="http://www.w3.org/2000/svg"
>
	<path d={path} />
</svg>

<!--//fill={fill} doesent work ??-->