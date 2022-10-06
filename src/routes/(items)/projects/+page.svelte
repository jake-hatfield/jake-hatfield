<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);
</script>

<SEO title="projects" metaDescription="see what jake hatfield is working on." />

<section>
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">projects</h1>
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
