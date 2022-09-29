<script lang="ts">
	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ articles } = data);

	$: console.log(articles);
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">articles</h1>
	</header>

	<ul>
		{#each articles as article}
			<li>{article.title}</li>
		{/each}
	</ul>
</section>
