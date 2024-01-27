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
	$: ({ changelogs } = data);

	// seo
	const title = 'Changelogs';
	const slug = 'changelogs';
	const seoProps = {
		breadcrumbs: [{ title, slug }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription: 'Read what Jake Hatfield is thinking about.',
		readingTime: '5 mins.',
		slug,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="header text-3xl font-black">Changelogs</h1>
	</header>
	<ul>
		{#each changelogs as changelog}
			<Item item={changelog} />
		{:else}
			<EmptyState emptyState={emptyState.changelogs} />
		{/each}
	</ul>
</section>
