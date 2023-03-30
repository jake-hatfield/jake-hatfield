<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

	// props
	export let data: LayoutData;
	$: ({ image, item, seoProps } = data);
</script>

{#key item.title}
	<SEO {...seoProps} />

	<section class="content-section-text">
		<article id="content-markdown" itemscope itemtype="http://schema.org/Article">
			<header>
				<h1 class="inline-block text-2xl font-black md:text-3xl">
					{item.title}
				</h1>
				<Header {item} />
			</header>
			<div>
				<img
					class="mt-12 w-full border-2 border-violet-700"
					src={`${image}.jpg`}
					alt={`${item.title}'s hero image`}
				/>
			</div>
			<div class="content">
				<slot />
			</div>
		</article>
		{#if item.relatedPosts && item.relatedPosts.length > 0}
			<ul class="content-section mb-content">
				{#each item.relatedPosts as rel}
					<li
						class="ml-6 h-72 w-56 min-w-[225px] overflow-hidden border-2 border-transparent bg-neutral-800 text-white transition duration-150 first:ml-0 hover:border-rose-600"
					>
						{rel.title}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/key}
