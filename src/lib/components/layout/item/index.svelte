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
	$: ({ description, image, summary, slug, title, type } = item);

	$: href = `/${type}/${slug}`;
</script>

<li class="mt-5 border-2 border-neutral-800 bg-neutral-900">
	<a
		aria-label={`View the ${title} ${handlePluralization.singular(type)}`}
		class="group relative block h-full max-h-64 w-full overflow-hidden transition ease-in-out lg:max-h-80"
		{href}
	>
		<div
			class="h-64 border-b-2 border-neutral-800 bg-cover bg-center duration-500 group-hover:scale-110 lg:h-80 "
			style={`background-image: url("/images/items/${image}")`}
		/>
		<div class="absolute inset-0 bg-lime-400 opacity-0 duration-300 group-hover:opacity-30" />
	</a>
	<div class="p-5">
		<header>
			<h2 class="text-xl font-black">
				{title}
			</h2>
			<Header {item} />
			{#if description}
				<div class="mt-3 flex items-start">
					<ChevronRight class="mt-0.5 flex-none text-orange-400" size={20} />
					<p class="ml-3 text-neutral-400">{description}</p>
				</div>
			{/if}
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
