<script lang="ts">
	import Button from '$components/utilities/Button.svelte';
	import FeaturedProject from '$components/layout/FeaturedProject.svelte';
	import Image from '$components/utilities/Image.svelte';
	import Link from '$components/utilities/Link.svelte';
	import Recent from '$components/layout/item/Recent.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import SendAltFilled from 'carbon-icons-svelte/lib/SendAltFilled.svelte';

	import emptyState from '$lib/metadata/emptyState';
	import metadata from '$lib/metadata';
	import { getPageSeoProps } from '$lib/metadata/seo';

	import AvatarWebp from '$assets/images/rasters/avatar.jpeg?width=832&format=webp';
	import Avatar from '$assets/images/rasters/avatar.jpeg?width=832';

	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ articles, featuredProject, projects } = data);

	const seoProps = getPageSeoProps({
		breadcrumbs: [{ title: 'Home', slug: '' }],
		metaDescription:
			'Jake Hatfield is a frontend lead at Teak and a self-taught engineer in Houston, TX. Explore featured work, client testimonials, and writing on product development.',
		slug: '',
		title: 'Home',
	});
</script>

<SEO {...seoProps} />

<section class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
	<div class="order-2 md:order-1 md:w-3/5">
		<header>
			<p class="header text-lg font-black">
				<span role="img" aria-label="Waving emoji">👋</span> Howdy, I'm
			</p>
			<h1 class="header pt-3 text-3xl font-black md:text-4xl">Jake Hatfield</h1>
			<p class="content-uppercase mt-3 text-lime-400">Frontend lead · Houston, TX</p>
		</header>
		<p class="mt-5 text-neutral-200">
			I design and ship digital products from zero to production — currently leading frontend at
			<Link href="https://helloteak.com" isExternal isUnderlined title="Teak" />.
		</p>
		<p class="mt-3 text-neutral-300">
			This site is where I share
			<Link href="/projects" isUnderlined title="work" />,
			<Link href="/articles" isUnderlined title="writing" />, and the projects I'm most proud of.
		</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/resume.pdf" icon={ArrowRight} kind="secondary" title="View my resume" />
			<Button
				href={`mailto:${metadata.email}`}
				icon={SendAltFilled}
				kind="primary"
				title="Say hello"
			/>
		</div>
	</div>
	<div class="order-1 mx-auto w-full max-w-xs md:order-2 md:mx-0 md:w-2/5 md:max-w-sm">
		<Image
			alt="Jake Hatfield"
			height={300}
			loading="eager"
			sources={[
				{ srcset: AvatarWebp, type: 'image/webp' },
				{ srcset: Avatar, type: 'image/jpeg' },
			]}
			src={Avatar}
			width={268}
		/>
	</div>
</section>

{#if featuredProject}
	<FeaturedProject item={featuredProject} />
{/if}

<Recent
	emptyState={emptyState.projects}
	heading="More projects"
	items={projects}
	type="projects"
/>

<Recent emptyState={emptyState.articles} heading="Recent writing" items={articles} type="articles" />
