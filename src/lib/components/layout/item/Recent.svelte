<script lang="ts">
	// components
	import EmptyState from '$components/layout/EmptyState.svelte';
	import Item from '$components/layout/item/index.svelte';
	import Link from '$components/utilities/Link.svelte';

	// icons
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';

	// types
	import type { FinalizedItem, Types } from '$types/markdown/Item';
	import type { EmptyState as EmptyStateType } from '$types/EmptyState';

	// * required props *
	export let emptyState: EmptyStateType;
	export let items: FinalizedItem[];
	export let type: Types;
</script>

<section class="mt-content">
	<header
		class="header border-b-2 border-neutral-900 pb-1.5 md:flex md:items-end md:justify-between"
	>
		<h2 class="text-xl font-black md:text-2xl">Recent {type}</h2>
		<Link
			class="mt-3 md:mt-0"
			href={`/${kebabCase(type)}`}
			icon={ArrowRight}
			isBlock
			title="See all"
		/>
	</header>
	<ul>
		{#each items as item}
			<Item {item} />
		{:else}
			<EmptyState emptyState={{ ...emptyState, title: `No ${type}` }} />
		{/each}
	</ul>
</section>
