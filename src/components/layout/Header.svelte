<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import { InformationSquare, SendAlt } from 'carbon-icons-svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';

	// data
	const primaryLinks = ['home', 'articles', 'changelog', 'projects', 'resume', 'uses'];

	const secondaryLinks = [
		{ icon: InformationSquare, title: 'about' },
		{ icon: SendAlt, title: 'contact' },
	];
</script>

<nav aria-label="header" class="mt-3 flex w-full items-center justify-between">
	<ul class="flex items-center">
		{#each primaryLinks as link}
			<li class="ml-3 first:ml-0">
				<Button href={link === 'home' ? './' : `./${kebabCase(link)}`} kind="ghost" title={link} />
			</li>
		{/each}
	</ul>
	<ul class="flex items-center">
		{#each secondaryLinks as link}
			<li class="ml-3 first:ml-0">
				<Button
					href={`./${kebabCase(link.title)}`}
					icon={link.icon}
					kind="ghost"
					title={link.title} />
			</li>
		{/each}
	</ul>
</nav>
