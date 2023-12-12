<script>
	import { onMount } from 'svelte';
	let rows = 18;
	let cols = 10;

	let selectedColor = null;
	let btnShowSaveDialog = false;

	const getClickedCells = () => {
		return JSON.parse(localStorage.getItem('clickedCells') || '[]');
	};

	const isSelectedCell = (row, col) => {
		return getClickedCells().some((cell) => cell.row === row && cell.col === col);
	};

	const isSkippedCell = (cellId) => {
		const skippedCells = [
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
		];
		return skippedCells.includes(cellId);
	};

	const addCellToLocalStorage = (row, col, color) => {
		const clickedCells = getClickedCells();
		clickedCells.push({ row, col, color });
		updateLocalStorage(clickedCells);
	};

	const updateLocalStorage = (clickedCells) => {
		localStorage.setItem('clickedCells', JSON.stringify(clickedCells));
	};

	const removeCellFromLocalStorage = (row, col) => {
		const clickedCells = getClickedCells();
		const index = clickedCells.findIndex((cell) => cell.row === row && cell.col === col);
		if (index !== -1) {
			clickedCells.splice(index, 1);
			updateLocalStorage(clickedCells);
		}
	};

	const fetchData = async (url, data) => {
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (!response.ok) throw new Error('Network response was not ok.');
			return response.json();
		} catch (error) {
			console.error('Fetch error:', error);
		}
	};

	//  ---

	const btnShowTemporaryBoulder = () => {
		const data = getClickedCells().reduce((acc, cell) => {
			(acc[cell.color] = acc[cell.color] || []).push(cell.row + cell.col);
			return acc;
		}, {});
		fetchData('ShowTemporaryBoulder', data);
	};

	const btnClearWall = () => {
		localStorage.removeItem('clickedCells');
		document.querySelectorAll('.holds').forEach((cell) => {
			cell.classList.remove('holds', 'topHolds', 'startHolds');
		});
	};

	const btnDialogSaveNewBoulder = () => {
		btnShowSaveDialog = false;
		const name = document.querySelector('#input1').value;
		const difficulty = document.querySelector('#input2').value;
		const data = getClickedCells().reduce((acc, cell) => {
			(acc[cell.color] = acc[cell.color] || []).push(cell.row + cell.col);
			return acc;
		}, {});
		fetchData('SaveNewBoulder', { clickedCells: data, name, difficulty });
	};

	const btnDalogHideAndClearSave = () => {
		btnShowSaveDialog = false;
		document.querySelector('#input1').value = '';
		document.querySelector('#input2').value = '';
	};

	const handleCellClick = (event) => {
		const cell = event.target;
		// let selectedRow = cell.dataset.row;
		// let selectedCol = cell.dataset.col;

		if (!cell.classList.contains('skipped')) {
			const { row, col } = cell.dataset;

			console.log('Clicked cell:', row, col); // logging statement

			if (isSelectedCell(row, col)) {
				cell.classList.remove('holds', 'topHolds', 'startHolds');
				removeCellFromLocalStorage(row, col);
				console.log('Cell removed from localStorage:', row, col); // logging statement
			} else {
				cell.classList.toggle('holds');
				if (selectedColor) {
					cell.classList.add(selectedColor);
				}
				addCellToLocalStorage(row, col, selectedColor || 'holds');
				console.log('Cell added to localStorage:', row, col, selectedColor || 'holds'); // logging statement
			}

			selectedColor = null;
		}
	};

	const restoreClickedState = () => {
		const clickedCells = getClickedCells();
		clickedCells.forEach((cell) => {
			const selector = `[data-row="${cell.row}"][data-col="${cell.col}"]`;
			const targetCell = document.querySelector(selector);
			if (targetCell) {
				targetCell.classList.add('holds', cell.color);
			}
		});
	};

	onMount(() => {
		restoreClickedState();
	});

	$: tableRows = Array.from({ length: rows }, (_, rowIndex) => String.fromCharCode(65 + rowIndex));
	$: tableCols = Array.from({ length: cols }, (_, colIndex) => colIndex);
</script>

{#if btnShowSaveDialog}
	<div class="backdrop">
		<div class="modal">
			<div>
				<input id="input1" placeholder="Name" />
				<input id="input2" placeholder="Difficulty" />
			</div>
			<button on:click={btnDialogSaveNewBoulder}>Save</button>
			<button on:click={btnDalogHideAndClearSave}>Cancel</button>
		</div>
	</div>
{/if}

<div id="NewBouderContent" class="flex justify-center">
	<div>
		<table class="wall">
			<tr>
				<th></th>
				{#each tableCols as col}
					<th>{col}</th>
				{/each}
			</tr>
			{#each tableRows as row}
				<tr>
					<th>{row}</th>
					{#each tableCols as col}
						{#if isSkippedCell(`${row}${col}`)}
							<td class="skipped"></td>
						{:else}
							<td on:click={handleCellClick} data-row={row} data-col={col}>
								{row}{col}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</table>

		<div class="flex justify-between gap-x-2 gap-y-3">
			<button on:click={() => (selectedColor = 'topHolds')}>Top</button>
			<button on:click={() => (selectedColor = 'startHolds')}>Start</button>
			<button on:click={btnShowTemporaryBoulder}>Show</button>
			<button on:click={btnClearWall}>Clear</button>
			<button on:click={() => (btnShowSaveDialog = true)}>Save</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.backdrop {
		@apply fixed inset-0 bg-black bg-opacity-60;
	}

	.modal {
		@apply p-2.5 rounded-lg max-w-sm mx-auto my-10 text-center bg-white;
	}

	.wall {
		@apply table-fixed border-separate mb-6 text-xs sm:text-base;
	}

	:global(.wall th),
	:global(.wall td) {
		@apply w-7 h-7 text-center rounded-sm tabular-nums slashed-zero sm:w-8 sm:h-8;
	}

	:global(.wall th) {
		@apply font-bold text-slate-400;
	}

	:global(.wall td:not(.skipped)) {
		@apply cursor-pointer border bg-sky-50 border-sky-300 hover:bg-sky-100 hover:border-sky-400 hover:text-sky-600;
	}
	:global(.wall td.holds) {
		@apply bg-green-400 border-green-400 text-green-900 hover:bg-green-200;
	}

	:global(.wall td.topHolds) {
		@apply bg-red-400 border-red-400 text-red-900 hover:bg-red-200;
	}

	:global(.wall td.startHolds) {
		@apply bg-purple-400  border-purple-400 text-purple-900 hover:bg-purple-200;
	}

	:global(.wall td:nth-child(7)) {
		@apply border-l border-l-slate-600 hover:border-l-slate-600;
	}
	:global(.wall td:nth-child(6)) {
		@apply border-r border-r-slate-600 hover:border-r-slate-600;
	}

	button {
		@apply rounded-md px-3 py-1 text-sm font-medium text-sky-500 cursor-pointer ring-1 ring-sky-500 sm:text-base hover:bg-sky-100 hover:text-sky-600 hover:ring-1;
	}
</style>
