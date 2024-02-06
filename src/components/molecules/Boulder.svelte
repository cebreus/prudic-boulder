<script>
	import {
		isSkippedCell,
		toggleCell,
		setMode,
		saveBoulder,
		clearBoulder
	} from '../utils/functions.mjs';
	import { boulders, clickedCells, selector } from '../molecules/BoulderStore.svelte';
	import Button from '../atoms/Button.svelte';

	let rows = 18;
	let cols = 10;
	const baseClass = 'w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8';
	const baseClasses = `${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600`;
	const skippedClass = `skipped ${baseClass}`;
	const clickedClass = `holds ${baseClass} bg-green-400 border-green-400 text-green-900 hover:bg-green-200`;

	const startClass = `cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600 bg-yellow-400 border-green-400 text-green-900`;
	const topClass = ` cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600 bg-red-400 border-red-400 text-red-900`;

	let selectingMode, selectedStartCell, selectedTopCell;
	selector.subscribe(($selector) => {
		({ selectingMode, selectedStartCell, selectedTopCell } = $selector);
	});

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);

	$: console.log('Clicked Cells:', $clickedCells);
	$: console.log('boulder:', $boulders);
</script>

<pre class="my-5">
Buttons: 

- Top" sets the end of the path
- Start" sets start of path
- Show" sends data to server, server lights up wall
- Clear" clears set data Boulder
- Save" send data to server
</pre>

<table class="wall mb-6 table-fixed border-separate text-xs sm:text-base">
	<thead>
		<tr>
			<th></th>
			{#each Array(cols) as _, col (col)}
				<th
					class="h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8"
					>{col}</th
				>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tableRows as row, rowIndex}
			<tr>
				<th
					class="h-7 w-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8"
				>
					{String.fromCharCode(65 + rowIndex)}
				</th>
				{#each tableCols as col}
					{@const cellId = row + col}
					<td
						class={(selectingMode === 'Start' && selectedStartCell === cellId) ||
						selectedStartCell === cellId
							? startClass
							: (selectingMode === 'Top' && selectedTopCell === cellId) ||
								  selectedTopCell === cellId
								? topClass
								: $clickedCells?.has(cellId)
									? clickedClass
									: isSkippedCell(cellId)
										? skippedClass
										: baseClasses}
						on:click={() => {
							toggleCell(cellId);
						}}
					>
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<Button emoji="⏯️" size="m" onClick={() => setMode('Start')}>Start</Button>
<Button emoji="🔝" size="l" onClick={() => setMode('Top')}>Top</Button>
<Button emoji="💾" size="xl" onClick={() => saveBoulder()}>Save</Button>
<Button emoji="🗑️" size="m" onClick={() => clearBoulder()}>Clear</Button>
