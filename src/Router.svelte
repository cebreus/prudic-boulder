<script>
	import Router from 'svelte-spa-router';
	import NewBoulder from './components/templates/NewBoulder.svelte';
	import Playground from './components/templates/Playground.svelte';
	import BouldersTable from './components/templates/BouldersTable.svelte';

	const routes = {
		'/': BouldersTable,
		'/new-boulder': NewBoulder,
		'/playground': Playground
	};
</script>

<Router {routes} />
