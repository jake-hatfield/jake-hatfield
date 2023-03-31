<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Recent from '$components/layout/item/Recent.svelte';

	// lib
	import emptyState from '$lib/metadata/emptyState';

	// assets
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.jpeg?width=832;268&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.jpeg?width=832;268&srcset';
	import Avatar from '$assets/images/rasters/avatar.jpeg?width=832';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ articles, changelogs, imagePlaceholders, projects } = data);

	// seo
	const seoProps = {
		breadcrumbs: [{ title: 'Home', slug: '' }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription:
			"If you're new, start here. See what Jake Hatfield is learning about, thinking about, and working on.",
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
			<p class="text-lg font-black">
				<span role="img" aria-label="Waving emoji">👋</span> Howdy, I'm
			</p>
			<h1 class="pt-3 text-3xl font-black">Jake Hatfield</h1>
		</header>
		<p class="mt-5">
			I'm a self-taught full-stack software engineer running a bootstrapped solo business in
			Houston, TX. <span role="img" aria-label="Pin emoji">📌</span>
		</p>
		<p class="mt-3">
			I want to design and build digital products like other people play piano, so I created this
			site to share what <Link href="/projects" isUnderlined title="projects" />, <Link
				href="/changelogs"
				isUnderlined
				title="learnings"
			/>, and <Link href="/articles" isUnderlined title="thoughts" /> are helping me achieve this goal.
		</p>
		<p class="mt-3">
			<mark>I'm currently looking to join a team of other software engineers</mark>
			who are solving meaningful problems on a bigger scale than I can accomplish completely on my own.
			<span role="img" aria-label="Call me hand emoji">🤙</span>
		</p>
	</div>
	<Image
		alt="Jake Hatfield"
		class="md:ml-8 md:w-1/3"
		height={300}
		loading="eager"
		placeholder={imagePlaceholders[0]}
		sources={[
			{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
			{ srcset: AvatarSrcset, type: 'image/png' },
		]}
		src={Avatar}
		width={268}
	/>
</section>
<Recent emptyState={emptyState.projects} items={projects} type="projects" />
<Recent emptyState={emptyState.changelogs} items={changelogs} type="changelogs" />
<Recent emptyState={emptyState.articles} items={articles} type="articles" />
