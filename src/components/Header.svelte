<script lang="ts">
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import MenuToggler from '../icons/MenuToggler.svelte';
	import Logo from '../icons/Logo.svelte';

	export let currentPath = '';

	let menuOpen = false;
	let svgElement: HTMLElement;

	onMount(() => {
		svgElement = document.querySelector('#menu-toggler') as HTMLElement;
	});

	const resetSvgAnimation = () => {
		const newSvgElement = svgElement.cloneNode(true) as HTMLElement;
		svgElement.parentNode!.replaceChild(newSvgElement, svgElement);
		svgElement = newSvgElement; // update svgElement to reference the new node
	};

	const toggleMenu = () => {
		menuOpen = !menuOpen;
		tick().then(() => {
			if (!menuOpen) {
				resetSvgAnimation();
			}
		});
	};

	let menuItems = [
		{ name: 'New boulder', path: '/new-boulder' },
		{ name: 'Playground', path: '/playground' }
	];
</script>

<nav class="relative z-10 bg-slate-100 border-b border-slate-200">
	<div class="container mx-auto">
		<div class="relative flex h-14 items-center justify-between px-4">
			<a href="/" class="flex items-center"
				><Logo class="block h-6 w-auto mr-4 text-sky-900 hover:text-sky-600 mb-0.5" /></a
			>
			<div class="absolute inset-y-0 right-3 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					aria-controls="mobile-menu"
					aria-expanded={menuOpen}
					on:click={toggleMenu}
				>
					<MenuToggler class="block h-7 w-7 cursor-pointer" id="menu-toggler" />
					<span class="sr-only">Otevřít hlavní menu</span>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div id="desktop-menu" class="hidden sm:block">
					<div class="flex space-x-2">
						{#each menuItems as { name, path } (path)}
							<a
								href={path}
								class="block rounded-md px-3 py-1.5 text-sm font-medium text-sky-500 {currentPath ===
								path
									? ' text-sky-900 ring-1 ring-slate-200'
									: ' text-sky-500 hover:bg-sky-100 hover:text-sky-600 hover:ring-1 hover:ring-sky-200'}"
								aria-current={currentPath === path ? 'page' : undefined}
							>
								{name}
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div
		class={`${
			menuOpen ? 'block' : 'hidden'
		} absolute left-0 right-0 top-full max-h-80 origin-top-right transform overflow-y-auto bg-slate-800 transition-all sm:visible`}
		id="mobile-menu"
	>
		<div class="space-y-1 px-2 pb-3 pt-2">
			{#each menuItems as { name, path } (path)}
				<a
					href={path}
					class="block rounded-md px-3 py-2 text-base font-medium {currentPath === path
						? 'bg-slate-900 text-white'
						: 'text-slate-300 hover:bg-slate-700 hover:text-white'}"
					aria-current={currentPath === path ? 'page' : undefined}
					on:click={toggleMenu}
				>
					{name}
				</a>
			{/each}
		</div>
	</div>
</nav>
