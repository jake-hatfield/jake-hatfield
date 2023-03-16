<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);

	// leadgeek
	// - v1 site
	// - v1 app
	// - v2
	// - chrome extension
	// graphene
	// transform writing
	// star wars discord bot
</script>

<SEO title="Projects" metaDescription="See what Jake Hatfield is working on." />

<section>
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">Projects</h1>
	</header>

	{#if projects?.length > 0}
		<ul>
			{#each projects as project}
				<Item item={project} />
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
