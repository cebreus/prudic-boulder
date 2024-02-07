<script>
	export let variation = 'info'; // Default variation

	const getAlertClasses = () => {
		switch (variation) {
			case 'success':
				return 'bg-green-100 border border-green-400 text-green-700';
			case 'warning':
				return 'bg-yellow-100 border border-yellow-400 text-yellow-700';
			case 'error':
				return 'bg-red-100 border border-red-400 text-red-700';
			default:
				return 'bg-blue-100 border border-blue-400 text-blue-700';
		}
	};
</script>

<div class="{getAlertClasses()} relative rounded px-4 py-3" role="alert">
	<strong class="flex items-center justify-center font-bold">
		<slot />
	</strong>
	<span class="absolute bottom-0 right-0 top-0 px-4 py-3"> </span>
</div>
