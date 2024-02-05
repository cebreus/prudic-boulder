<script>
	import { writable } from 'svelte/store';

	let rows = 18;
	let cols = 10;
	const baseClass = 'w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8';
	const baseClasses = `${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600`;
	const skippedClass = `skipped ${baseClass}`;
	const clickedClass = `holds ${baseClass} bg-green-400 border-green-400 text-green-900 hover:bg-green-200`;

	const cellsToSkip = new Set([
		'B0',
		'B3',
		'B6',
		'B9',
		'C1',
		'C2',
		'C4',
		'C5',
		'C7',
		'C8',
		'D0',
		'D3',
		'D6',
		'D9',
		'E1',
		'E2',
		'E4',
		'E5',
		'E7',
		'F0',
		'F3',
		'F6',
		'F9',
		'G1',
		'G2',
		'G4',
		'G5',
		'G7',
		'G8',
		'H0',
		'H3',
		'H6',
		'H9',
		'I1',
		'I2',
		'I4',
		'I5',
		'I7',
		'I8',
		'J0',
		'J3',
		'J6',
		'J9',
		'K1',
		'K2',
		'K4',
		'K5',
		'K7',
		'K8',
		'L0',
		'L3',
		'L6',
		'L9',
		'M1',
		'M2',
		'M4',
		'M5',
		'M7',
		'M8',
		'N0',
		'N3',
		'N6',
		'N9',
		'O1',
		'O2',
		'O4',
		'O5',
		'O7',
		'O8',
		'P0',
		'P3',
		'P6',
		'P9',
		'Q0',
		'Q1',
		'Q4',
		'Q5',
		'Q8',
		'Q9',
		'R1',
		'R3',
		'R6',
		'R8'
	]);

	const clickedCells = writable(new Set());

	const isSkippedCell = (cellId) => {
		return cellsToSkip.has(cellId);
	};

	$: tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	$: tableCols = Array.from({ length: cols }, (_, i) => i);
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
						class={isSkippedCell(cellId)
							? skippedClass
							: $clickedCells.has(cellId)
								? clickedClass
								: baseClasses}
					>
						{isSkippedCell(cellId) ? '' : cellId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
