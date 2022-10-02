<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import { InformationSquare, SendAlt } from 'carbon-icons-svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';
	import metadata from '$lib/metadata';

	// data
	const primaryLinks = ['home', 'articles', 'changelogs', 'projects', 'uses'];

	const secondaryLinks = [
		{ href: '/about', icon: InformationSquare, title: 'about' },
		{ href: `mailto:${metadata.personalEmail}`, icon: SendAlt, title: 'contact' },
	];
</script>

<header class="w-full">
	<nav class="mt-3 flex w-full items-center justify-between">
		<ul class="flex items-center">
			{#each primaryLinks as link}
				<li class="ml-3 first:ml-0">
					<Button href={link === 'home' ? '/' : `/${kebabCase(link)}`} kind="ghost" title={link} />
				</li>
			{/each}
		</ul>
		<ul class="flex items-center">
			{#each secondaryLinks as { href, icon, title }}
				<li class="ml-3 first:ml-0">
					<Button {href} {icon} kind="ghost" {title} />
				</li>
			{/each}
		</ul>
	</nav>
</header>
