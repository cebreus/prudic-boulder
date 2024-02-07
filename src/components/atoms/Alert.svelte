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

<div class="{getAlertClasses()} px-4 py-3 rounded relative" role="alert">
	<strong class="font-bold flex items-center justify-center">
		<slot></slot>
	</strong>
	<span class="absolute top-0 bottom-0 right-0 px-4 py-3">
  </span>
</div>

