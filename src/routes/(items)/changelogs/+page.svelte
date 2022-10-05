<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/SEO.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ changelogs } = data);
</script>

<SEO title="changelogs" metaDescription="read what jake hatfield is thinking about." />

<section>
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">changelogs</h1>
	</header>

	{#if changelogs?.length > 0}
		<ul>
			{#each changelogs as changelog}
				<Item item={changelog} />
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
