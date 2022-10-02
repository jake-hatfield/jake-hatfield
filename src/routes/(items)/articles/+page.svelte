<script lang="ts">
	// components
	import Item from '$components/layout/Item.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ articles } = data);
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">articles</h1>
	</header>
	<ul>
		{#each articles as article}
			<Item item={article} type={'articles'} />
		{/each}
	</ul>
</section>
