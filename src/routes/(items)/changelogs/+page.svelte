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
</script>

<SEO title="Changelogs" metaDescription="Read what Jake Hatfield is thinking about." />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">Changelogs</h1>
	</header>
	<ul>
		{#each changelogs as changelog}
			<Item item={changelog} />
		{:else}
			<EmptyState emptyState={emptyState.changelogs} />
		{/each}
	</ul>
</section>
