<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import Link from '$components/utilities/Link.svelte';

	// icons
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';

	// lib
	import { handlePluralization } from '$lib/utilities/string';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ description, excerpt, slug, title, type } = item);

	$: href = `/${type}/${slug}`;
</script>

<li class="mt-5 border border-neutral-700 bg-neutral-900 p-5">
	<header>
		<h2 class="text-xl font-black">
			{title}
		</h2>
		<Header {item} />
		<div class="mt-3 flex items-start">
			<ChevronRight class="mt-0.5 flex-none text-orange-400" size={20} />
			<p class="ml-3">{description}</p>
		</div>
	</header>
	<p class="mt-3">
		{excerpt}...
	</p>
	<Link
		class="mt-3"
		{href}
		icon={ArrowRight}
		isBlock
		isUnderlined
		title={`View ${handlePluralization.singular(type)}`}
	/>
</li>
