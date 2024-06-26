<script lang="ts">
	import { clickedGrips, selector, boulders } from '../../stores/BoulderStore.svelte';
	import { rows, cols, isSkippedGrip } from '../../utils/utils';
	import log from '../../utils/logger';

	export let selectedBoulderID: string | undefined = undefined;
	export let color: string | undefined = undefined;

	export const tableRows = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));
	export const tableCols = Array.from({ length: cols }, (_, i) => i);

	$: selectedMode = $selector.selectedMode;

	const toggleGripAndUpdateSelector = (gripId: string) => {
		if (isSkippedGrip(gripId)) {
			log.debug(`Toggling grip: ${gripId} SKIPPED with mode: ${$selector.selectedMode}`);
			return;
		}
		log.debug(`Toggling grip: ${gripId} with mode: ${$selector.selectedMode}`);
		selector.updateSelector(gripId, selectedMode);

		clickedGrips.toggle(gripId, selectedMode, color);
	};
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
					{@const gripId = `${row}${col}`}
					<td
						class:skipped={isSkippedGrip(gripId)}
						class={`${boulders.getGripClass(selectedBoulderID, gripId).class} ${$clickedGrips.get(gripId)?.class ?? ''}`}
						style:background-color={selectedBoulderID
							? boulders.getGripClass(selectedBoulderID, gripId).color
							: $clickedGrips.get(gripId)?.color ?? ''}
						on:click={selectedBoulderID
							? null
							: () => {
									toggleGripAndUpdateSelector(gripId);
								}}
					>
						{isSkippedGrip(gripId) ? '' : gripId}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="postcss">
	:global(table.wall) {
		@apply table-fixed border-separate text-xs sm:text-base;
	}
	:global(table.wall th) {
		@apply size-7 rounded-sm text-center slashed-zero tabular-nums text-slate-400 sm:h-8 sm:w-8 dark:text-slate-400;
	}
	:global(table.wall td) {
		@apply size-7 rounded-sm text-center slashed-zero tabular-nums transition-colors sm:h-8 sm:w-8;
	}
	:global(table.wall td:not(.skipped)) {
		@apply cursor-pointer border-2 border-sky-300 bg-sky-50 text-sky-600 hover:border-sky-400 hover:bg-sky-100 hover:text-sky-700 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-200  dark:hover:bg-sky-900 dark:hover:text-white;
	}
	:global(table.wall td.holds) {
		@apply border-amber-300 bg-amber-100 text-amber-600 hover:border-amber-400 hover:bg-amber-200 hover:text-amber-700 dark:border-amber-400 dark:bg-amber-600 dark:text-amber-200  dark:hover:border-amber-200 dark:hover:bg-amber-600 dark:hover:text-white;
	}
	:global(table.wall td.start) {
		@apply border-green-300 bg-green-100 text-green-600 hover:border-green-400 hover:bg-green-100 hover:text-green-700 dark:border-green-400 dark:bg-green-600 dark:text-green-200  dark:hover:border-green-200 dark:hover:bg-green-600 dark:hover:text-white;
	}
	:global(table.wall td.finish) {
		@apply border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:border-fuchsia-400 hover:bg-fuchsia-100 hover:text-fuchsia-700 dark:border-fuchsia-400 dark:bg-fuchsia-600 dark:text-fuchsia-200  dark:hover:border-fuchsia-200 dark:hover:bg-fuchsia-600 dark:hover:text-white;
	}
</style>
