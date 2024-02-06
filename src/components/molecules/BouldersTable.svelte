<script>
	import { boulders } from '../molecules/BoulderStore.svelte';
</script>

<!-- TODO: @artem Click on the ID should open modal with visualisation on a boulder -->
<!-- TODO: @artem add button for delete the boulder -->

{#if $boulders?.length > 0}
	<div id="table-container" class="overflow-x-auto">
		<table id="dataTable" class="w-full text-left text-sm">
			<thead class="bg-slate-50 text-xs uppercase text-slate-500">
				<tr class="border-b bg-white">
					<th class="px-3 py-3 lg:px-6 lg:py-3">ID</th>
					<th class="px-3 py-3 lg:px-6 lg:py-3">Cells</th>
				</tr>
			</thead>
			<tbody>
				{#each $boulders as boulder (boulder.id)}
					<tr>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.id}</td>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.clickedCells}</td>
					</tr>{/each}
			</tbody>
		</table>
	</div>
{:else}
	<!-- TODO: @artem create new component `atoms/Alert.svelte` -->
	<!-- TODO> @strem  message id OK? What if I haven't no boulders created? -->
	<div class="alert">No boulders loaded. Please refresh the page.</div>
{/if}
