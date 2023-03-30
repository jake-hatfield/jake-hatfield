<script lang="ts">
	// components
	import OpenGraph from '$components/utilities/seo/OpenGraph.svelte';
	import Schema from '$components/utilities/seo/Schema.svelte';
	import Twitter from '$components/utilities/seo/Twitter.svelte';

	// lib
	import metadata from '$lib/metadata';

	// types
	import type { Image } from '$types/markdown/Image';

	// destructure items from metadata
	const {
		author,
		description,
		social: { github },
		keywords,
		ogLanguage,
		siteLanguage,
		siteTitle,
		siteUrl,
	} = metadata;

	// * required props *
	export let isMarkdownItem = false;
	export let createdAt: string;
	export let metaDescription: string;
	export let readingTime: string;
	export let slug: string;

	// optional props
	export let breadcrumbs: { title: string; slug: string }[] = [];
	export let entityMeta: {
		url: string;
		faviconWidth: number;
		faviconHeight: number;
		caption: string;
	} | null = null;
	export let isIndexed = true;
	export let shortMetaDescription = description;
	export let title = 'Online Arbitrage Lead Marketplace';
	export let updatedAt = metadata.createdAt;

	// global page title format
	const pageTitle = `${title} - ${siteTitle}`;
	const url = `${siteUrl}/${slug}`;
	const imageUrl = encodeURI(
		`${siteUrl}/api/open-graph?title=${title}&description=${shortMetaDescription}`,
	);

	// open graph
	const openGraphProps = {
		isMarkdownItem,
		image: {
			url: imageUrl + '&format=rect',
			alt: shortMetaDescription,
		},
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
		image: { url: imageUrl + '&format=rectAlt', alt: shortMetaDescription },
		isMarkdownItem,
		metaDescription,
		siteLanguage,
		siteUrl,
		title: pageTitle,
		updatedAt,
		url,
	};

	// twitter
	const twitterProps = {
		isMarkdownItem,
		image: {
			url: imageUrl + '&format=square',
			alt: shortMetaDescription,
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
	<link rel="canonical" href={url} />
</svelte:head>
<Twitter {...twitterProps} />
<OpenGraph {...openGraphProps} />
<Schema {...schemaProps} />
