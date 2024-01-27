<script lang="ts">
	// components
	import EmptyState from '$components/layout/EmptyState.svelte';
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import emptyState from '$lib/metadata/emptyState';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);

	// seo
	const title = 'Projects';
	const slug = 'projects';
	const seoProps = {
		breadcrumbs: [{ title, slug }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription: 'See what Jake Hatfield is working on.',
		readingTime: '5 mins.',
		slug,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
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
