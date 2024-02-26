<script>
	import Router from 'svelte-spa-router';
	import NewBoulder from './components/templates/NewBoulder.svelte';
	import BouldersTable from './components/molecules/BouldersTable.svelte';

	const routes = {
		'/': BouldersTable,
		'/new-boulder': NewBoulder,
		'/playground': BouldersTable
	};
</script>

<Router {routes} />
