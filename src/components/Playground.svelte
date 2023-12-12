<script>
	import { onMount } from 'svelte';
	var colorPicker;
	onMount(() => {
		colorPicker = new iro.ColorPicker('#colorPicker', {
			// Set the size of the color picker
			width: 320,
			wheelLightness: false,
			// Set the initial color to pure red
			color: '#ffffff'
		});

		function handleCellClick(event) {
			if (!event.target.classList.contains('skipped')) {
				var row = event.target.dataset.row;
				var col = event.target.dataset.col;

				var hex = colorPicker.color.hexString;
				console.log(hex);

				if (isSelectedCell(row, col)) {
					event.target.classList.remove('holds');
					event.target.style.background = '';
					removeCellFromLocalStorage(row, col);
				} else {
					event.target.classList.toggle('holds');
					event.target.style.background = hex;
					addCellToLocalStorage(row, col, hex);
				}
			}
		}

		function isSelectedCell(row, col) {
			var clickedCells = getClickedCells();
			return clickedCells.some(function (cell) {
				return cell.row === row && cell.col === col;
			});
		}

		function removeCellFromLocalStorage(row, col) {
			var clickedCells = getClickedCells();
			var index = clickedCells.findIndex(function (cell) {
				return cell.row === row && cell.col === col;
			});
			if (index !== -1) {
				clickedCells.splice(index, 1);
				updateLocalStorage(clickedCells);
			}
		}

		function createTable(rows, cols) {
			var table = document.getElementById('wall');

			var thead = document.createElement('thead');
			var headerRow = document.createElement('tr');
			headerRow.appendChild(document.createElement('th'));

			for (var i = 0; i < cols; i++) {
				var th = document.createElement('th');
				th.textContent = i;
				headerRow.appendChild(th);
			}

			thead.appendChild(headerRow);
			table.appendChild(thead);

			var tbody = document.createElement('tbody');

			for (var j = 65; j < 65 + rows; j++) {
				var rowChar = String.fromCharCode(j);
				var rowElement = document.createElement('tr');
				var thRow = document.createElement('th');
				thRow.textContent = rowChar;
				rowElement.appendChild(thRow);

				for (var k = 0; k < cols; k++) {
					var colElement = document.createElement('td');
					colElement.dataset.row = rowChar;
					colElement.dataset.col = k;
					var cellId = rowChar + k;

					if (isSkippedCell(cellId)) {
						colElement.classList.add('skipped');
					} else {
						colElement.classList.add('cell');
						colElement.textContent = cellId;
						colElement.addEventListener('click', handleCellClick);
					}

					rowElement.appendChild(colElement);
				}

				tbody.appendChild(rowElement);
			}

			table.appendChild(tbody);
			//document.body.appendChild(table);
		}

		function isSkippedCell(cellId) {
			return [
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
			].includes(cellId);
		}

		function restoreClickedState() {
			var clickedCells = getClickedCells();
			clickedCells.forEach(function (cell) {
				console.log('set' + '[data-row="' + cell.row + '"][data-col="' + cell.col + '"]');
				var targetCell = document.querySelector(
					'[data-row="' + cell.row + '"][data-col="' + cell.col + '"]'
				);
				if (targetCell) {
					targetCell.classList.add('holds');
					targetCell.style.background = cell.color;
				}
			});
		}

		createTable(18, 10);

		restoreClickedState();
	});

	function updateLocalStorage(clickedCells) {
		localStorage.setItem('coloredClickedCells', JSON.stringify(clickedCells));
	}

	function getClickedCells() {
		var clickedCells = localStorage.getItem('coloredClickedCells');
		return clickedCells ? JSON.parse(clickedCells) : [];
	}

	function addCellToLocalStorage(row, col, color) {
		var clickedCells = getClickedCells();
		clickedCells.push({
			row: row,
			col: col,
			color: color
		});
		updateLocalStorage(clickedCells);
	}

	function show() {
		var clickedCells = getClickedCells();
		var data = {};
		clickedCells.forEach(function (cell) {
			data[cell.row + cell.col] = cell.color;
		});

		fetch('ShowColoredCells', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(function (result) {
				console.log('Success:', result);
			})
			.catch(function (error) {
				console.error('Error:', error);
			});
	}

	function fillAll() {
		document.querySelectorAll('.cell').forEach(function (cell) {
			cell.classList.clear;
			cell.classList.add('holds');
			var hex = colorPicker.color.hexString;
			cell.style.background = hex;
			var row = cell.dataset.row;
			var col = cell.dataset.col;
			addCellToLocalStorage(row, col, hex);
		});
	}

	function clear() {
		localStorage.removeItem('coloredClickedCells');
		document.querySelectorAll('.holds').forEach(function (cell) {
			cell.classList.remove('holds');
			cell.style.background = '';
		});
	}
</script>

<div class="flex justify-center">
	<div>
		<table id="wall" class="wall justify-center bg-gray-200"></table>
		<div id="buttons" class="flex justify-center">
			<button on:click={show}>Show</button>
			<button on:click={fillAll}>All</button>
			<button on:click={clear}>Clear</button>
			<button on:click={show}>Save</button>
		</div>
		<div id="colorPicker" class="mt-5 element no-dark-mode mb-10"></div>
	</div>
</div>

<style>
	.backdrop {
		width: 100%;
		height: 100%;
		position: fixed;
		background: rgba(0, 0, 0, 0.6);
	}

	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 300px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
	table {
		border-collapse: collapse;
		margin: 5px;
	}

	.wall :global(th) {
		border: 1px solid #444;
		width: 28px;
		height: 28px;
		text-align: center;
		cursor: pointer;
	}

	.wall :global(td) {
		border: 1px solid #444;
		width: 28px;
		height: 28px;
		text-align: center;
		cursor: pointer;
	}

	.wall :global(td[data-col='5']) {
		border-left: 2px solid #111;
	}

	.wall :global(td[data-col='4']) {
		border-right: 2px solid #111;
	}

	button {
		margin-top: 8px;
		margin-right: 4px;
		margin-left: 4px;
		padding: 2px 10px;
		border-color: #111;
		border-width: 1px;
		border-radius: 10%;
		cursor: pointer;
	}
</style>
