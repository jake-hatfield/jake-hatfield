<script lang="ts">
	// components
	import OpenGraph from '$components/utilities/seo/OpenGraph.svelte';
	import Schema from '$components/utilities/seo/Schema.svelte';
	import Twitter from '$components/utilities/seo/Twitter.svelte';

	// lib
	import metadata from '$lib/metadata';

	// assets
	// 672x448 px
	import featuredImageSrc from '$assets/images/rasters/pages/home/index.jpg';
	// 1200x630 px
	import ogSrc from '$assets/images/rasters/pages/home/og.jpg';
	// 400x400 px
	import ogSquareSrc from '$assets/images/rasters/pages/home/og-square.jpg?url';

	// types
	import type Image from '$types/markdown/Image';

	// destructure items from metadata
	const {
		author,
		social: { github },
		keywords,
		ogLanguage,
		siteLanguage,
		siteTitle,
		siteUrl,
	} = metadata;

	// default items
	const defaultAlt = 'A black background with the title of the page';

	// * required props *
	export let isMarkdownItem = false;
	export let createdAt: string;
	export let metaDescription: string;
	export let readingTime: string;
	export let slug: string;
	export let title;
	export let updatedAt: string;

	// optional props
	export let breadcrumbs: { name: string; slug: string }[] = [];
	export let entityMeta: {
		url: string;
		faviconWidth: number;
		faviconHeight: number;
		caption: string;
	} | null = null;
	export let isIndexed = true;
	export let featuredImage = {
		url: featuredImageSrc,
		alt: defaultAlt,
		width: 672,
		height: 448,
		caption: 'home page',
	};
	export let ogImage: Image = {
		url: ogSrc,
		alt: defaultAlt,
	};
	export let ogImageSquare: Image = {
		url: ogSquareSrc,
		alt: defaultAlt,
	};

	// global page title format
	const pageTitle = `${title} - ${siteTitle}`;
	const url = `${siteUrl}/${slug}`;

	// open graph
	const openGraphProps = {
		isMarkdownItem,
		image: ogImage,
		imageSquare: ogImageSquare,
		metaDescription,
		ogLanguage,
		pageTitle,
		siteTitle,
		siteUrl,
		url,
		...(isMarkdownItem ? { createdAt, updatedAt } : { createdAt: '', updatedAt: '' }),
	};

	// schema
	const schemaProps = {
		author,
		breadcrumbs,
		createdAt,
		entity: author,
		entityMeta,
		featuredImage,
		github,
		isMarkdownItem,
		metaDescription,
		siteLanguage,
		siteTitle,
		siteTitleAlt: siteTitle,
		siteUrl,
		title: pageTitle,
		updatedAt,
		url,
	};

	// twitter
	const twitterProps = {
		isMarkdownItem,
		image: {
			url: ogSrc,
			alt: defaultAlt,
		},
		metaDescription,
		readingTime,
		title: pageTitle,
		url,
	};
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={metaDescription} />
	<meta name="keywords" content={String(keywords)} />
	<meta
		name="robots"
		content={isIndexed
			? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
			: 'noindex, nofollow'}
	/>
	<html lang={siteLanguage} />
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<Schema {...schemaProps} />
