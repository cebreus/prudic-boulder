import plugin from 'tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography'),
		plugin(function({ addUtilities }) {
			const newUtilities = {
				'.size-5': {
					width: '1.25rem',
					height: '1.25rem',
				},
				'.size-6': {
					width: '1.5rem',
					height: '1.5rem',
				},
				'.size-7': {
					width: '1.75rem',
					height: '1.75rem',
				},
			};
			addUtilities(newUtilities);
		}),
	]
};
