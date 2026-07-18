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

	// props
	export let data: PageData;
	const { items, tag } = data;

	const title = `#${tag}`;
	const seoProps = getPageSeoProps({
		breadcrumbs: [
			{ title: 'tags', slug: 'tags' },
			{ title, slug: tag },
		],
		metaDescription: `View items tagged "${tag}"`,
		readingTime: '1 mins.',
		slug: `tags/${tag}`,
		title,
	});
</script>

<SEO {...seoProps} />

{#key tag}
	<section>
		<header class="border-b-2 border-neutral-900 pb-1.5">
			<h1 class="header text-3xl font-black">
				#{tag}
			</h1>
		</header>
		{#if items && items.length > 0}
			<ul>
				{#each items as item}
					<Item {item} />
				{/each}
			</ul>
		{:else}
			<EmptyState emptyState={emptyState.tags} />
		{/if}
	</section>
{/key}
