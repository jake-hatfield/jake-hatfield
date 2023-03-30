<script lang="ts">
	// lib
	import metadata from '$lib/metadata/index';

	// types
	import type { Image } from '$types/markdown/Image';

	// * required props *
	export let image: Image;
	export let metaDescription: string;
	export let title: string;
	export let readingTime: string;
	export let url: string;

	// optional props
	export let author = metadata.author;
	export let isMarkdownItem = false;
	export let twitterUsername = '';
</script>

<svelte:head>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={metaDescription} />
	<meta name="twitter:url" content={url} />
	{#if image}
		<meta name="twitter:image" content={image.url} />
		<meta name="twitter:image:alt" content={image.alt} />
	{/if}
	{#if twitterUsername}
		<meta name="twitter:creator" content={`@${twitterUsername}`} />
		<meta name="twitter:site" content={`@${twitterUsername}`} />
	{/if}
	<meta name="twitter:label1" content="Written by" />
	<meta name="twitter:data1" content={author} />
	{#if isMarkdownItem && readingTime}
		<meta name="twitter:label2" content="Est. reading time" />
		<meta name="twitter:data2" content={readingTime} />
	{/if}
</svelte:head>
