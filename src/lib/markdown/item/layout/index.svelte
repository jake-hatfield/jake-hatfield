<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import {
		getItemImagePath,
		getItemImageSrcset,
	} from '$lib/utilities/image/itemHero';

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
				<picture>
					<source
						sizes="(max-width: 768px) 100vw, (max-width: 1024px) 960px, 1280px"
						srcset={getItemImageSrcset(item.image)}
						type="image/webp"
					/>
					<img
						class="mt-12 w-full border-2 border-violet-700"
						src={getItemImagePath(item.image)}
						alt={`${item.title}'s hero image`}
						decoding="async"
						loading="lazy"
					/>
				</picture>
			</div>
			<div class="content">
				<slot />
			</div>
		</article>
	</section>
{/key}
