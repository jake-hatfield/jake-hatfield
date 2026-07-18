<script lang="ts">
	// components
	import EmptyState from '$components/layout/EmptyState.svelte';
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import emptyState from '$lib/metadata/emptyState';
	import { getPageSeoProps } from '$lib/metadata/seo';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);

	// seo
	const title = 'Projects';
	const slug = 'projects';
	const seoProps = getPageSeoProps({
		metaDescription: 'See what Jake Hatfield is working on.',
		slug,
		title,
	});
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="header text-3xl font-black">Projects</h1>
	</header>
	<ul>
		{#each projects as project}
			<Item item={project} />
		{:else}
			<EmptyState emptyState={emptyState.projects} />
		{/each}
	</ul>
</section>
