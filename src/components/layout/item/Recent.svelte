<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';

	// types
	import type { FinalizedItem, Types } from '$types/markdown/Item';

	// * required props *
	export let type: Types;
	export let items: FinalizedItem[];
</script>

<section class="mt-8">
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h2 class="text-2xl font-black">recent {type}</h2>
	</header>
	<ul>
		{#each items as item}
			<Item {item} />
		{/each}
	</ul>
</section>
