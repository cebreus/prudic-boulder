<script>
	import {
		addBoulder,
		boulders,
		clickedCells,
		selectedStart,
		selectedTop
	} from '../clickedCells.js';

	let rows = 18;
	let cols = 10;
	const baseClass = 'w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8';
	const baseClasses = `${baseClass} cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600`;
	const skippedClass = `skipped ${baseClass}`;
	const clickedClass = `holds ${baseClass} bg-green-400 border-green-400 text-green-900 hover:bg-green-200`;
	const startClass = `cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600 bg-yellow-400 border-green-400 text-green-900`;
	const topClass = ` cursor-pointer bg-sky-50 border border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600 bg-red-400 border-red-400 text-red-900`;

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

	const isSkippedCell = (cellId) => {
		return cellsToSkip.has(cellId);
	};

	const toggleCell = (cellId) => {
		if (!isSkippedCell(cellId)) {
			const newClickedCells = new Set($clickedCells);

			if (state.selectingMode === 'Start') {
				state = { ...state, selectedStartCell: cellId };
				selectedStart(cellId);
			} else if (state.selectingMode === 'Top') {
				state.selectedTopCell = cellId;
				state = { ...state, selectedTopCell: cellId };
			} else {
				if (newClickedCells.has(cellId)) {
					newClickedCells.delete(cellId);
				} else {
					newClickedCells.add(cellId);
				}
			}

			clickedCells.set(newClickedCells);
			state = { ...state, selectingMode: null };
		}
	};

	let state = {
		selectingMode: null,
		selectedStartCell: null,
		selectedTopCell: null
	};

	const setMode = (mode) => {
		state = { ...state, selectingMode: mode };
		console.log(`Selecting ${mode}`);
	};

	//dopsat
	const showOnServer = () => {
		console.log('Show on Server');
	};

	const clearBoulder = () => {
		state = { ...state, selectedStartCell: null, selectedTopCell: null };
		clickedCells.set(new Set());
	};

	const saveBoulder = () => {
		addBoulder($clickedCells);
	};

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

<table class="wall table-fixed border-separate mb-6 text-xs sm:text-base">
	<thead>
		<tr>
			<th></th>
			{#each Array(cols) as _, col (col)}
				<th
					class="w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8 text-slate-400"
					>{col}</th
				>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each tableRows as row, rowIndex}
			<tr>
				<th
					class="w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8 text-slate-400"
				>
					{String.fromCharCode(65 + rowIndex)}
				</th>
				{#each tableCols as col}
					{@const cellId = row + col}
					<td
						class={(state.selectingMode === 'Start' && state.selectedStartCell === cellId) ||
						state.selectedStartCell === cellId
							? startClass
							: (state.selectingMode === 'Top' && state.selectedTopCell === cellId) ||
								  state.selectedTopCell === cellId
								? topClass
								: $clickedCells.has(cellId)
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

<button on:click={() => setMode('Start')}>Start</button>
<button on:click={() => setMode('Top')}>Top</button>
<button on:click={() => saveBoulder()}>Save</button>
<button on:click={() => clearBoulder()}>Clear</button>
