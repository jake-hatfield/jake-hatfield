<script lang="ts">
	// components
	import Article from '$components/items/Article.svelte';
	import CTA from '$components/layout/CTA.svelte';

	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ articles } = data);
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">articles</h1>
		<CTA />
	</header>

	<ul>
		{#each articles as article}
			<Article {article} />
		{/each}
	</ul>
</section>
