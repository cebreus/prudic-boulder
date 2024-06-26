<script lang="ts">
	import { slide } from 'svelte/transition';
	import { twMerge } from 'tailwind-merge';
	import Logo from '../../icons/Logo.svelte';
	import MenuToggler from '../../icons/MenuToggler.svelte';

	export let currentPath = '';

	let menuOpen = false;

	const defaultClass = 'block rounded-md px-3 py-1.5 text-sm font-medium transition-colors';
	const activeClass =
		'text-sky-700 ring-1 ring-slate-200 hover:text-sky-900 dark:text-slate-500 dark:ring-slate-500';
	const inactiveClass =
		'text-sky-500 hover:bg-sky-100 hover:text-sky-600 hover:ring-1 hover:ring-sky-200 dark:hover:bg-transparent dark:hover:text-sky-400 dark:hover:ring-sky-400';

	const mobileDefaultClass = `${defaultClass} py-2`;
	const mobileActiveClass = 'bg-slate-900 text-white';
	const mobileInactiveClass = 'text-slate-300 hover:bg-slate-700 hover:text-white';

	const menuItemsClass = (path: string) => {
		return twMerge(defaultClass, currentPath === path ? activeClass : inactiveClass);
	};

	const mobileMenuItemsClass = (path: string) => {
		return twMerge(
			mobileDefaultClass,
			currentPath === path ? mobileActiveClass : mobileInactiveClass
		);
	};

	const toggleMenu = () => {
		menuOpen = !menuOpen;
	};

	let menuItems = [
		{ name: 'New boulder', path: '/new-boulder' },
		{ name: 'Playground', path: '/playground' }
	];
</script>

<nav
	class="relative z-10 border-b border-slate-200 bg-slate-100 dark:border-slate-900 dark:bg-slate-950"
>
	<div class="container mx-auto">
		<div class="relative flex h-14 items-center justify-between px-4">
			<a href="/" class="flex items-center" on:click={() => (menuOpen = false)}
				><Logo
					class="mb-0.5 mr-4 block h-6 w-auto text-sky-900 transition-colors hover:text-sky-600 dark:text-sky-500 dark:hover:text-sky-400"
				/></a
			>
			<div class="absolute inset-y-0 right-3 flex items-center sm:hidden">
				<!-- Mobile menu button-->
				<button
					type="button"
					class="inline-flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
					aria-controls="mobile-menu"
					aria-expanded={menuOpen}
					on:click={toggleMenu}
				>
					<MenuToggler class="block size-7 cursor-pointer" id="menu-toggler" />
					<span class="sr-only">Otevřít hlavní menu</span>
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<div id="desktop-menu" class="hidden sm:block">
					<div class="flex space-x-2">
						{#each menuItems as { name, path } (path)}
							<a
								href={path}
								class={menuItemsClass(path)}
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
	{#if menuOpen}
		<div
			transition:slide
			class="absolute left-0 right-0 top-full max-h-80 origin-top-right overflow-y-auto bg-slate-800 sm:hidden"
			id="mobile-menu"
		>
			<div class="space-y-1 px-2 py-3">
				{#each menuItems as { name, path } (path)}
					<a href={path} class={mobileMenuItemsClass(path)} on:click={toggleMenu}>
						{name}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</nav>
