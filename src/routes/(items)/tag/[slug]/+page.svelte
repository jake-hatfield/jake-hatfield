<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ items, tag } = data);
</script>

<SEO title={`#${tag}`} metaDescription={`view items tagged "${tag}"`} />

<section>
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">
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
		nothing here
	{/if}
</section>
