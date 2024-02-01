<script>
	const btnClearWall = () => {
		console.log('Before btnClearWall():', localStorage.getItem('clickedCells'));
		localStorage.removeItem('clickedCells');
		console.log('After btnClearWall() :', localStorage.getItem('clickedCells'));

		document.querySelectorAll('.holds').forEach((cell) => {
			cell.classList.remove('holds');
			// cell.classList.remove('holds', 'topHolds', 'startHolds');
			cell.className = '';
		});
	};
</script>

<button
	on:click={btnClearWall}
	class="rounded-md px-3 py-1 text-sm font-medium text-sky-500 cursor-pointer ring-1 ring-sky-500 sm:text-base hover:bg-sky-100 hover:text-sky-600 hover:ring-1"
	>Clear</button
>
