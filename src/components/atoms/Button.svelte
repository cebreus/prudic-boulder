<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	// Exported props for external configuration
	let classNames = '';
	export { classNames as class };
	export let emoji = '';
	export let variant:
		| ''
		| 'disabled'
		| 'green'
		| 'link'
		| 'linkGreen'
		| 'linkRed'
		| 'linkYellow'
		| 'outline'
		| 'outlineGreen'
		| 'outlineRed'
		| 'outlineYellow'
		| 'primary'
		| 'red'
		| 'yellow' = 'primary';
	// export let onClick = () => {};
	export let disabled: boolean = false;
	export let href: string = '';
	export let submit: boolean = false;

	const defaultClass: string =
		'inline-flex justify-center rounded md:rounded-md px-2.5 py-1 text-sm md:text-base md:px-4 md:py-1.5 font-semibold leading-6 disabled:cursor-not-allowed disabled:pointer-events-none focus:ring focus:outline-none';

	const variantClasses: Record<string, string> = {
		primary:
			'bg-sky-500 text-white hover:bg-sky-800 focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-500 dark:focus:ring-sky-800',
		green:
			'bg-green-500 text-white hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-500 dark:focus:ring-green-800',
		red: 'bg-rose-500 text-white hover:bg-rose-800 focus:ring-rose-300 dark:bg-rose-600 dark:hover:bg-rose-500 dark:focus:ring-rose-800',
		yellow:
			'bg-yellow-500 text-white hover:bg-yellow-800 focus:ring-yellow-300 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:focus:ring-yellow-800',
		disabled:
			'bg-slate-500 text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-600 focus:ring-0',
		redText:
			'text-red-600 underline underline-offset-2 hover:no-underline focus:no-underline hover:text-red-500 focus:ring-red-500 dark:text-red-500 dark:hover:text-red-400 dark:focus:ring-red-500',
		link: 'text-sky-500 underline underline-offset-2 hover:no-underline focus:no-underline hover:text-sky-800 focus:ring-sky-300 dark:text-sky-600 dark:hover:text-sky-600 dark:focus:ring-sky-500 dark:focus:ring-opacity-50',
		linkGreen:
			'text-green-500 underline underline-offset-2 hover:no-underline focus:no-underline hover:text-green-800 focus:ring-green-300 dark:text-green-600 dark:hover:text-green-600 dark:focus:ring-green-500 dark:focus:ring-opacity-50',
		linkRed:
			'text-rose-500 underline underline-offset-2 hover:no-underline focus:no-underline hover:text-rose-800 focus:ring-rose-300 dark:text-rose-600 dark:hover:text-rose-600 dark:focus:ring-rose-500 dark:focus:ring-opacity-50',
		linkYellow:
			'text-yellow-500 underline underline-offset-2 hover:no-underline focus:no-underline hover:text-yellow-800 focus:ring-yellow-300 dark:text-yellow-600 dark:hover:text-yellow-600 dark:focus:ring-yellow-500 dark:focus:ring-opacity-50',
		outline:
			'bg-transparent text-sky-500 hover:text-white ring-1 ring-sky-500 hover:bg-sky-500 hover:ring-0 focus:ring-sky-300 dark:text-sky-600 dark:hover:text-white dark:hover:bg-sky-600 dark:focus:ring-sky-800',
		outlineGreen:
			'bg-transparent text-green-500 hover:text-white ring-1 ring-green-500 hover:bg-green-500 hover:ring-0 focus:ring-green-300 dark:text-green-600 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800',
		outlineRed:
			'bg-transparent text-rose-500 hover:text-white ring-1 ring-rose-500 hover:bg-rose-500 hover:ring-0 focus:ring-rose-300 dark:text-rose-600 dark:hover:text-white dark:hover:bg-rose-600 dark:focus:ring-rose-800',
		outlineYellow:
			'bg-transparent text-yellow-500 hover:text-white ring-1 ring-yellow-500 hover:bg-yellow-500 hover:ring-0 focus:ring-yellow-300 dark:text-yellow-600 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-800'
	};

	// Update the disabled prop if the color prop is set to 'disabled'
	$: if (variant === 'disabled') {
		disabled = true;
	}

	// Final class construction
	$: buttonClass = twMerge(
		defaultClass,
		variantClasses[disabled ? 'disabled' : variant],
		classNames
	);
</script>

{#if href && !disabled}
	<a class={`no-underline ${buttonClass}`} {href} data-cy="button" {...$$restProps}>
		{#if emoji}
			<span role="presentation">{emoji}</span>
		{/if}
		<slot />
	</a>
{:else if href && disabled}
	<span
		class={`no-underline ${buttonClass} cursor-default opacity-50`}
		data-cy="button"
		{...$$restProps}
	>
		{#if emoji}
			<span role="presentation">{emoji}</span>
		{/if}
		<slot />
	</span>
{:else}
	<button
		class={buttonClass}
		disabled={disabled || undefined}
		type={submit ? 'submit' : 'button'}
		data-cy="button"
		on:click
		{...$$restProps}
	>
		{#if emoji}
			<span role="presentation">{emoji}</span>
		{/if}
		<slot />
	</button>
{/if}
