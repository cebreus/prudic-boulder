<script>
	import {
		clickedClass,
		cols,
		isSkippedCell,
		rows,
		skippedClass,
		startClass,
		topClass
	} from '../utils/constants.mjs';

	export let selectingMode = null;
	export let selectedStartCell = null;
	export let selectedTopCell = null;
	export let toggleCell; // = ??
	export let selectedBoulder; // = ??

	export let clickedCells;

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);
</script>

<table class="wall">
	<thead>
		<tr>
			<th></th>
			{#each tableCols as col (col)}
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
						class={(() => {
							let classList = selectedBoulder ? 'pointer-events-none ' : '';
							classList +=
								(selectedBoulder
									? selectedBoulder.pathStart === cellId
										? startClass
										: selectedBoulder.pathEnd === cellId
											? topClass
											: selectedBoulder.clickedCells?.has(cellId)
												? clickedClass
												: isSkippedCell(cellId)
													? skippedClass
													: ''
									: (selectingMode === 'Start' && selectedStartCell === cellId) ||
										  selectedStartCell === cellId
										? startClass
										: (selectingMode === 'Top' && selectedTopCell === cellId) ||
											  selectedTopCell === cellId
											? topClass
											: clickedCells?.has(cellId)
												? clickedClass
												: isSkippedCell(cellId)
													? skippedClass
													: '') + '';
							return classList;
						})()}
						on:click={selectedBoulder ? null : () => toggleCell(cellId)}
					>
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	:global(table.wall) {
		@apply mb-6 table-fixed border-separate text-xs sm:text-base;
	}
	:global(table.wall th) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8 dark:text-slate-400;
	}
	:global(table.wall td) {
		@apply h-7 w-7 rounded-sm text-center slashed-zero tabular-nums sm:h-8 sm:w-8;
	}
	:global(table.wall td:not(.skipped)) {
		@apply cursor-pointer border border-sky-300 bg-sky-50 text-sky-600 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200  dark:hover:bg-sky-900 dark:hover:text-white;
	}
	:global(table.wall td.holds) {
		@apply border-amber-300 bg-amber-100 text-amber-600 hover:border-amber-400 hover:bg-amber-200 hover:text-amber-700 dark:border-amber-400 dark:bg-amber-600 dark:text-amber-200  dark:hover:border-amber-200 dark:hover:bg-amber-600 dark:hover:text-white;
	}
	:global(table.wall td.start) {
		@apply border-green-300 bg-green-100 text-green-600 hover:border-green-400 hover:bg-green-100 hover:text-green-700 dark:border-green-400 dark:bg-green-600 dark:text-green-200  dark:hover:border-green-200 dark:hover:bg-green-600 dark:hover:text-white;
	}
	:global(table.wall td.top) {
		@apply border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-700 dark:border-fuchsia-400 dark:bg-fuchsia-600 dark:text-fuchsia-200  dark:hover:border-fuchsia-200 dark:hover:bg-fuchsia-600 dark:hover:text-white;
	}
</style>
