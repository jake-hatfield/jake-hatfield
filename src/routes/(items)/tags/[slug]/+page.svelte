<script lang="ts">
	// components
	import Item from '$components/layout/item/index.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	const { items, tag } = data;

	// seo
	const title = `#${tag}`;
	const slug = tag;
	const seoProps = {
		breadcrumbs: [
			{ title: 'tags', slug: 'tags' },
			{ title, slug },
		],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription: `View items tagged "${tag}"`,
		readingTime: '1 mins.',
		slug: `tags/${tag}`,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

{#key tag}
	<section>
		<header class="border-b-2 border-neutral-900 pb-1.5">
			<h1 class="text-3xl font-black header">
				#{tag}
			</h1>
		</header>
		{#if items && items.length > 0}
			<ul>
				{#each items as item}
					<Item {item} />
				{/each}
			</ul>
		{:else}
			nothing here
		{/if}
	</section>
{/key}
