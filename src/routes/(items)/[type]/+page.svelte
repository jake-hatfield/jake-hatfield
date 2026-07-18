<script lang="ts">
	// components
	import EmptyState from '$components/layout/EmptyState.svelte';
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import emptyState from '$lib/metadata/emptyState';
	import { itemListMeta } from '$lib/metadata/itemLists';
	import { getPageSeoProps } from '$lib/metadata/seo';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ items, type } = data);
	$: ({ metaDescription, title } = itemListMeta[type]);
	$: seoProps = getPageSeoProps({ metaDescription, slug: type, title });
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="header text-3xl font-black">{title}</h1>
	</header>
	<ul>
		{#each items as item}
			<Item {item} />
		{:else}
			<EmptyState emptyState={emptyState[type]} />
		{/each}
	</ul>
</section>
