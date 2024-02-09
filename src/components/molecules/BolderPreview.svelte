<script>

	import { isSkippedCell } from '../utils/constants.mjs';
	import {rows, cols, topClass, skippedClass, startClass, clickedClass} from '../utils/constants.mjs'

	export let selectedBoulder;

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);

</script>

<!--<table class="wall">-->
<!--	<thead>-->
<!--	<tr>-->
<!--		<th></th>-->
<!--		{#each Array(cols) as _, col (col)}-->
<!--			<th>{col}</th>-->
<!--		{/each}-->
<!--	</tr>-->
<!--	</thead>-->
<!--	<tbody>-->
<!--	{#each tableRows as row, rowIndex}-->
<!--		<tr>-->
<!--			<th>{String.fromCharCode(65 + rowIndex)}</th>-->
<!--			{#each tableCols as col}-->
<!--				{@const cellId = `${row}${col}`}-->
<!--				<td-->
<!--					class="{selectedBoulder.pathStart === cellId-->
<!--                        ? startClass-->
<!--                        : selectedBoulder.pathEnd  === cellId-->
<!--                        ? topClass-->
<!--                        : selectedBoulder.clickedCells?.has(cellId)-->
<!--                        ? clickedClass-->
<!--                        : isSkippedCell(cellId)-->
<!--                        ? skippedClass-->
<!--                        : ''}">-->
<!--					{isSkippedCell(cellId) ? '' : cellId}-->
<!--				</td>-->
<!--			{/each}-->
<!--		</tr>-->
<!--	{/each}-->
<!--	</tbody>-->
<!--</table>-->


<div class="flex justify-center items-center">
	<table class="wall border-separate border-spacing-0">
		<thead>
		<tr>
			<th></th>
			{#each Array(cols) as _, col (col)}
				<th>{col}</th>
			{/each}
		</tr>
		</thead>
		<tbody>
		{#each tableRows as row, rowIndex}
			<tr>
				<th>{String.fromCharCode(65 + rowIndex)}</th>
				{#each tableCols as col}
					{@const cellId = `${row}${col}`}
					<td
						class="{selectedBoulder.pathStart === cellId ? startClass : selectedBoulder.pathEnd  === cellId ? topClass : selectedBoulder.clickedCells?.has(cellId) ? clickedClass : isSkippedCell(cellId) ? skippedClass : ''} border border-slate-300">
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
		</tbody>
	</table>
</div>


<style lang="postcss">
    :global(table.wall) {
        @apply mb-6 table-fixed border-separate text-xs sm:text-base;
    }
    :global(table.wall th) {
        @apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8;
    }
    :global(table.wall td) {
        @apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums sm:h-8 sm:w-8;
    }
    :global(table.wall td:not(.skipped)) {
        @apply cursor-pointer border border-sky-300 bg-sky-50 text-sky-600 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700;
    }
    :global(table.wall td.holds) {
        @apply border-green-300 bg-green-100 text-green-600 hover:border-green-400 hover:bg-green-200 hover:text-green-700;
    }
    :global(table.wall td.start) {
        @apply border-indigo-300 bg-indigo-50 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-100 hover:text-indigo-700;
    }
    :global(table.wall td.top) {
        @apply border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-700;
    }
</style>
