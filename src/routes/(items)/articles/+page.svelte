<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/SEO.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ articles } = data);
</script>

<SEO title="articles" metaDescription="read what i'm learning about." />

<section>
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">articles</h1>
	</header>
	<ul>
		{#each articles as article}
			<Item item={article} />
		{/each}
	</ul>
</section>
