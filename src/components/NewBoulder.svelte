<script>
	import Boulder from './Boulder.svelte';
	import WallClear from './WallClear.svelte';
	import StartHandle from './StartHandle.svelte';
</script>

<div id="NewBouderContent" class="flex justify-center">
	<div>
		<Boulder />
		<div class="flex justify-between gap-x-2 gap-y-3">
			<StartHandle />
			<WallClear />
		</div>
	</div>
</div>
