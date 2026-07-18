<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import FeaturedProject from '$components/layout/FeaturedProject.svelte';
	import Image from '$components/utilities/Image.svelte';
	import Link from '$components/utilities/Link.svelte';
	import Recent from '$components/layout/item/Recent.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Social from '$components/layout/Social.svelte';
	import Testimonials from '$components/layout/Testimonials.svelte';

	// icons
	import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte';
	import SendAltFilled from 'carbon-icons-svelte/lib/SendAltFilled.svelte';

	// lib
	import emptyState from '$lib/metadata/emptyState';
	import metadata from '$lib/metadata';

	// assets
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.jpeg?width=832;268&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.jpeg?width=832;268&srcset';
	import Avatar from '$assets/images/rasters/avatar.jpeg?width=832';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ articles, featuredProject, imagePlaceholders, projects } = data);

	// seo
	const seoProps = {
		breadcrumbs: [{ title: 'Home', slug: '' }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription:
			'Jake Hatfield is a self-taught full-stack engineer in Houston, TX. Explore featured work, client testimonials, and writing on product development.',
		readingTime: '5 mins.',
		slug: '',
		title: 'Home',
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

<section class="md:flex md:items-start md:justify-between">
	<div class="mb-5 md:mb-0 md:w-2/3">
		<header>
			<p class="header text-lg font-black">
				<span role="img" aria-label="Waving emoji">👋</span> Howdy, I'm
			</p>
			<h1 class="header pt-3 text-3xl font-black">Jake Hatfield</h1>
		</header>
		<p class="mt-5">
			I'm a self-taught full-stack engineer in Houston, TX who designs and ships digital products
			from zero to production. <span role="img" aria-label="Pin emoji">📌</span>
		</p>
		<p class="mt-3">
			<mark>Open to full-time roles and select freelance projects.</mark> This site is where I share
			<Link href="/projects" isUnderlined title="projects" />, <Link
				href="/articles"
				isUnderlined
				title="writing"
			/>, and the work I'm most proud of.
		</p>
		<div class="mt-6 flex flex-wrap gap-3">
			<Button href="/resume.pdf" icon={ArrowRight} kind="secondary" title="View my resume" />
			<Button
				href={`mailto:${metadata.email}?subject=Let's%20work%20together`}
				icon={SendAltFilled}
				kind="primary"
				title="Get in touch"
			/>
		</div>
	</div>
	<div class="md:ml-8 md:w-1/3">
		<Image
			alt="Jake Hatfield"
			height={300}
			loading="eager"
			placeholder={imagePlaceholders[0]}
			sources={[
				{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
				{ srcset: AvatarSrcset, type: 'image/jpeg' },
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

<Testimonials />

<Recent emptyState={emptyState.articles} heading="Writing" items={articles} type="articles" />

<section class="mt-content">
	<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
		<h2 class="header text-2xl font-black">Let's connect</h2>
	</header>
	<p class="text-neutral-200">
		Want to talk about a role, a project, or just say hello? I'd love to hear from you.
	</p>
	<div class="mt-5 flex flex-wrap gap-3">
		<Button
			href={`mailto:${metadata.email}?subject=Let's%20work%20together`}
			icon={SendAltFilled}
			kind="primary"
			title="Email me"
		/>
		<Button href="/about" icon={ArrowRight} kind="secondary" title="About me" />
		<Button href="/resume.pdf" icon={ArrowRight} kind="ghost" title="View resume" />
	</div>
	<div class="mt-content">
		<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
			<h3 class="header text-xl font-black">My socials</h3>
		</header>
		<Social />
	</div>
</section>
