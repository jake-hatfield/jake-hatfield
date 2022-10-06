<script lang="ts">
	// components
	import OpenGraph from '$components/utilities/seo/OpenGraph.svelte';
	import SchemaOrg from '$components/utilities/seo/SchemaOrg.svelte';

	// lib
	import metadata from '$lib/metadata';

	// destructure items
	const { author, github, keywords, siteLanguage, siteTitle, siteUrl } = metadata;

	// default items
	const defaultAlt = '';

	// * required props *
	export let isMarkdownItem = false;
	export let createdAt: string;
	export let metaDescription: string;
	export let title;
	export let updatedAt: string;

	// optional props
	export let breadcrumbs: { name: string; slug: string }[] = [];
	export let isIndexed = true;
	export let ogImage = {
		url: './src/static/images/og/default.jpg',
		alt: defaultAlt,
	};
	export let ogImageSquare = {
		url: './src/static/images/og/default-square.jpg',
		alt: defaultAlt,
	};

	// global page title format
	const pageTitle = `${title} - ${siteTitle}`;

	// open graph
	const openGraphProps = {
		isMarkdownItem,
		image: ogImage,
		imageSquare: ogImageSquare,
		metaDescription,
		ogLanguage: 'en_US',
		pageTitle,
		siteTitle,
		siteUrl,
		...(isMarkdownItem ? { createdAt, updatedAt } : { createdAt: '', updatedAt: '' }),
	};

	// schema
	const schemaOrgProps = {
		isMarkdownItem,
		author,
		breadcrumbs,
		createdAt,
		entity,
		updatedAt,
		entityMeta,
		featuredImage,
		metaDescription,
		siteLanguage,
		siteTitle,
		siteTitleAlt: siteShortTitle,
		siteUrl,
		title: pageTitle,
		url,
		github,
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
			: 'noindex, nofollow'} />
	<html lang={siteLanguage} />
</svelte:head>
<OpenGraph {...openGraphProps} />
<SchemaOrg {...schemaOrgProps} />
