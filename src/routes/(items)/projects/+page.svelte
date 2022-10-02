<script lang="ts">
	// types
	import type { PageData } from './$types';

	// props
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
				<li>{project.title}</li>
			{:else}
				nothing here
			{/each}
		</ul>
	{/if}
</section>
