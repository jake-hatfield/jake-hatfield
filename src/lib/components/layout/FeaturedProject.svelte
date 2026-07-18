<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import Header from '$components/layout/item/Header.svelte';
	import Link from '$components/utilities/Link.svelte';

	// icons
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ description, image, site, slug, summary, title, type } = item);

	$: href = `/${type}/${slug}`;
</script>

<section class="mt-content">
	<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
		<h2 class="header text-2xl font-black">Featured work</h2>
	</header>
	<article class="border-2 border-neutral-800 bg-neutral-900">
		<a
			aria-label={`View the ${title} case study`}
			class="group relative block overflow-hidden"
			{href}
		>
			<div
				class="h-72 border-b-2 border-neutral-800 bg-cover bg-center duration-500 group-hover:scale-105 lg:h-96"
				style={`background-image: url("/images/items/${image}")`}
			/>
			<div class="absolute inset-0 bg-lime-400 opacity-0 duration-300 group-hover:opacity-20" />
		</a>
		<div class="p-5 lg:p-8">
			<header>
				<p class="content-uppercase text-lime-400">Flagship project</p>
				<h3 class="header mt-3 text-2xl font-black lg:text-3xl">
					<Link {href} isUnderlined {title} />
				</h3>
				<Header {item} />
			</header>
			<p class="mt-5 text-lg text-neutral-200">{summary}</p>
			{#if description}
				<p class="mt-3 text-neutral-400">{description}</p>
			{/if}
			<div class="mt-6 flex flex-wrap gap-3">
				<Button href={href} icon={ArrowRight} kind="secondary" title="View case study" />
				{#if site}
					<Button href={site} icon={Launch} isExternal kind="ghost" title="Live site" />
				{/if}
			</div>
		</div>
	</article>
</section>
