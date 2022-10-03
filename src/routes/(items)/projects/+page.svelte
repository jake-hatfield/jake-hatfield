<script lang="ts">
	// components
	import Item from '$components/layout/Item.svelte';
	import SEO from '$components/utilities/SEO.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);
</script>

<SEO title="projects" metaDescription="see what i'm working on." />

<section>
	<header>
		<h1 class="text-3xl font-black">projects</h1>
	</header>

	{#if projects?.length > 0}
		<ul>
			{#each projects as project}
				<Item item={project} type="projects" />
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
