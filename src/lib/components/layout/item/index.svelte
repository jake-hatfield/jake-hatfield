<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import Link from '$components/utilities/Link.svelte';

	// icons
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';

	// lib
	import { handlePluralization, kebabCase } from '$lib/utilities/string';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ description, summary, slug, title, type } = item);

	$: href = `/${type}/${slug}`;
</script>

<li class="mt-5 border-2 border-neutral-800 bg-neutral-900">
	<a
		aria-label={`View the ${title} ${handlePluralization.singular(type)}`}
		class="block h-full max-h-80 w-full"
		{href}
	>
		<div
			class="h-80 border-b-2 border-neutral-800 bg-cover bg-center"
			style={`background-image: url("images/items/${kebabCase(item.title)}.jpg")`}
		/>
	</a>
	<div class="p-5">
		<header>
			<h2 class="text-xl font-black">
				{title}
			</h2>
			<Header {item} />
			<div class="mt-3 flex items-start">
				<ChevronRight class="mt-0.5 flex-none text-orange-400" size={20} />
				<p class="ml-3 text-neutral-400">{description}</p>
			</div>
		</header>
		<p class="mt-3">
			{summary}
		</p>
		<Link
			class="mt-3"
			{href}
			icon={ArrowRight}
			isBlock
			isUnderlined
			title={`View ${handlePluralization.singular(type)}`}
		/>
	</div>
</li>
