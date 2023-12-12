<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const boulders = writable([]);

	onMount(async () => {
		try {
			const response = await fetch('/GetBouldersList');
			const data = await response.json();
			boulders.set(data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}

		var e = document.getElementById('dataTable'),
			t = e.getElementsByTagName('tbody')[0];

		t.addEventListener('click', function (t) {
			var n = t.target.closest('tr');
			if (n) {
				var s = e.getElementsByClassName('selected');
				0 < s.length && s[0].classList.remove('selected'), n.classList.add('selected');

				var s = n.cells[0].textContent,
					l = n.cells[1].textContent,
					d = n.cells[2].textContent;
				console.log('Selected ID:', s);

				fetch('/ShowBolder', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						selectedId: s,
						selectedName: l,
						selectedDifficulty: d
					})
				})
					.then((e) => {
						console.log('Server Response:', e);
					})
					.catch((e) => {
						console.error('Error:', e);
					});
			}
		});
	});
</script>

{#if $boulders.length > 0}
	<div id="table-container">
		<table id="dataTable" class="dataTable">
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
					<th>Difficulty</th>
				</tr>
			</thead>
			<tbody>
				{#each $boulders as boulder (boulder.i)}
					<tr>
						<td>{boulder.i}</td>
						<td>{boulder.n}</td>
						<td>{boulder.d}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="alert">No boulders loaded. Please refresh the page.</div>
{/if}

<style lang="postcss">
	table {
		@apply w-full text-left text-sm;
	}
	thead {
		@apply bg-slate-50 text-xs uppercase text-slate-500;
	}
	tbody tr {
		@apply border-b bg-white;
	}

	th {
		@apply px-3 py-3 lg:px-6 lg:py-3;
	}
	td {
		@apply px-3 py-1.5 lg:px-6 lg:py-3;
	}

	#table-container {
		flex: 1;
		overflow-y: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	.dataTable :global(tr.selected) {
		background-color: #9e9d9d;
	}

	.dataTable :global(td) {
		padding: 12px;
		text-align: left;
	}

	.dataTable :global(th) {
		padding: 12px;
		text-align: left;
	}

	.dataTable :global(tr:hover) {
		cursor: pointer;
	}
</style>
