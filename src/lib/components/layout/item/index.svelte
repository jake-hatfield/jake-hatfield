<script lang="ts">
	import Animated from '$components/layout/Animated.svelte';
	import Header from '$components/layout/item/Header.svelte';
	import Thumbnail from '$components/layout/item/Thumbnail.svelte';
	import Link from '$components/utilities/Link.svelte';

	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';

	import { handlePluralization } from '$lib/utilities/string';

	import type { FinalizedItem } from '$types/markdown/Item';

	export let item: FinalizedItem;

	$: ({ description, image, summary, slug, title, type } = item);
	$: href = `/${type}/${slug}`;
</script>

<Animated>
	<li class="list-card">
		<a
			aria-label={`View the ${title} ${handlePluralization.singular(type)}`}
			class="list-card-media group"
			{href}
		>
			<Thumbnail alt="" {image} imageClass="h-full min-h-full w-full object-cover" loading="lazy" />
			<div class="absolute inset-0 bg-lime-400 opacity-0 duration-300 group-hover:opacity-20" />
		</a>
		<div class="list-card-body">
			<header>
				<h2 class="header text-xl font-black">{title}</h2>
				<Header {item} />
				{#if description}
					<div class="mt-3 flex items-start">
						<ChevronRight class="mt-0.5 flex-none text-orange-400" size={20} />
						<p class="ml-3 text-neutral-200">{description}</p>
					</div>
				{/if}
			</header>
			<p class="mt-3 flex-1 text-neutral-300">{summary}</p>
			<Link
				class="mt-4"
				{href}
				icon={ArrowRight}
				isBlock
				isUnderlined
				title={`View ${handlePluralization.singular(type)}`}
			/>
		</div>
	</li>
</Animated>
