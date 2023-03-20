// icons
import AppDeveloper from 'carbon-pictograms-svelte/lib/AppDeveloper.svelte';
import Contract from 'carbon-pictograms-svelte/lib/Contract.svelte';
import Progress from 'carbon-pictograms-svelte/lib/Progress.svelte';

export default {
	articles: {
		description: "Articles keep you updated on what I'm thinking about",
		icon: Contract,
		title: 'No articles',
	},
	changelogs: {
		description: "Changelogs keep you updated on what I'm learning",
		icon: Progress,
		title: 'No changelogs',
	},
	projects: {
		description: "Projects keep you updated on what I'm building",
		icon: AppDeveloper,
		title: 'No projects',
	},
};
