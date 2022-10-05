<script lang="ts">
	// lib
	import metadata from '$lib/metadata';

	// destructure items
	const { keywords, siteLanguage, siteTitle } = metadata;

	// * required props *
	export let metaDescription: string;
	export let title;

	// optional props
	export let isIndexed = true;

	const pageTitle = `${title} - ${siteTitle}`;
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
