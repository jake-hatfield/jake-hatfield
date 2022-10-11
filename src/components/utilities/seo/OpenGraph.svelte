<script lang="ts">
	// types
	import type Image from '$types/markdown/Image';

	// * required props *
	export let createdAt: string;
	export let image: Image;
	export let imageSquare: Image;
	export let metaDescription: string;
	export let ogLanguage: string;
	export let pageTitle: string;
	export let siteTitle: string;
	export let siteUrl: string;
	export let updatedAt: string;

	// optional props
	export let isMarkdownItem = false;
</script>

<svelte:head>
	<meta property="og:site_name" content={siteTitle} />
	<meta property="og:locale" content={ogLanguage} />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:type" content={isMarkdownItem ? 'article' : 'website'} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={metaDescription} />
	{#if image}
		<meta property="og:image" content={image.url} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:image:alt" content={image.alt} />
	{/if}
	{#if imageSquare}
		<meta property="og:image" content={imageSquare.url} />
		<meta property="og:image:width" content="400" />
		<meta property="og:image:height" content="400" />
		<meta property="og:image:alt" content={image.alt} />
	{/if}
	{#if isMarkdownItem}
		<meta property="article:published_time" content={createdAt} />
		<meta property="article:modified_time" content={updatedAt} />
	{/if}
</svelte:head>
