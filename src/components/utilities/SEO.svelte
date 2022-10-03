<script lang="ts">
	// lib
	import data from '$lib/metadata';

	// destructure items
	const { siteLanguage, siteTitle } = data;

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
	<meta
		name="robots"
		content={isIndexed
			? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
			: 'noindex, nofollow'} />
	<html lang={siteLanguage} />
</svelte:head>
