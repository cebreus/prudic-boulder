<script>
	import Router from 'svelte-spa-router';
	import NewBoulder from './components/templates/NewBoulder.svelte';
	import BouldersTable from './components/molecules/BouldersTable.svelte';
	import Playground from './components/templates/Playground.svelte';

	const routes = {
		'/': BouldersTable,
		'/new-boulder': NewBoulder,
		'/playground': Playground
	};
</script>

<Router {routes} />
