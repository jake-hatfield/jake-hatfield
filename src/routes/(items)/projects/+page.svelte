<script lang="ts">
	// components
	import Item from '$components/layout/Item.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);
</script>

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
