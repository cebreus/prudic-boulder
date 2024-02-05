<script>
	import { writable } from 'svelte/store';

	const boulders = writable([]);
</script>

List of all generated boulders.

{#if $boulders.length > 0}
	<div id="table-container" class="overflow-x-auto">
		<table id="dataTable" class="w-full text-left text-sm">
			<thead class="bg-slate-50 text-xs uppercase text-slate-500">
				<tr class="border-b bg-white">
					<th class="px-3 py-3 lg:px-6 lg:py-3">ID</th>
					<th class="px-3 py-3 lg:px-6 lg:py-3">Name</th>
					<th class="px-3 py-3 lg:px-6 lg:py-3">Difficulty</th>
				</tr>
			</thead>
			<tbody>
				{#each $boulders as boulder (boulder.i)}
					<tr>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.i}</td>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.n}</td>
						<td class="px-3 py-1.5 lg:px-6 lg:py-3">{boulder.d}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="alert">No boulders loaded. Please refresh the page.</div>
{/if}
