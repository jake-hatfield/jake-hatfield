<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

	// props
	export let data: LayoutData;
	$: ({ item, seoProps } = data);
</script>

{#key item.title}
	<SEO {...seoProps} />

	<section class="content-section-text">
		<article id="content-markdown" itemscope itemtype="http://schema.org/Article">
			<header>
				<h1 class="header inline-block text-2xl font-black md:text-3xl">
					{item.title}
				</h1>
				<Header {item} />
			</header>
			<div>
				<img
					class="mt-12 w-full border-2 border-violet-700"
					src={`/images/items/${item.image}`}
					alt={`${item.title}'s hero image`}
					loading="lazy"
					decoding="async"
				/>
			</div>
			<div class="content">
				<slot />
			</div>
		</article>
	</section>
{/key}
