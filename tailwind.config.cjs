const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./index.html',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],

	theme: {
		screens: {
			xs: '475px',
			...defaultTheme.screens
		}
	},

	plugins: [require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')]
};

module.exports = config;
