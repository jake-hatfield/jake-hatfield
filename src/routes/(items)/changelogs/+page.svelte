<script lang="ts">
	// components
	import CTA from '$components/layout/CTA.svelte';
	import Item from '$components/layout/Item.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ changelogs } = data);
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">changelogs</h1>
		<CTA />
	</header>

	{#if changelogs?.length > 0}
		<ul>
			{#each changelogs as changelog}
				<Item item={changelog} type="changelogs" />
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
