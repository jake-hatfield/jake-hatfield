<script lang="ts">
	// types
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ changelogs } = data);

	$: console.log(changelogs);
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">changelogs</h1>
	</header>

	{#if changelogs?.length > 0}
		<ul>
			{#each changelogs as changelog}
				<li>{changelog.title}</li>
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
