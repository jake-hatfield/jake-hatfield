<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Recent from '$components/layout/item/Recent.svelte';

	// lib
	import metadata from '$lib/metadata';

	// assets
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.jpeg?width=832;268&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.jpeg?width=832;268&srcset';
	import Avatar from '$assets/images/rasters/avatar.jpeg?width=832';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ articles, changelogs, imagePlaceholders, projects } = data);

	// destructure
	const { author, siteUrl } = metadata;

	// seo
	const seoProps = {
		title: 'home',
		slug: '',
		entityMeta: {
			url: `${siteUrl}/`,
			faviconWidth: 512,
			faviconHeight: 512,
			caption: author,
		},
		createdAt: '2022-10-06T00:00:00.000+0100',
		updatedAt: '2022-10-06T00:00:00.000+0100',
		breadcrumbs: [{ name: 'home', slug: '' }],
		metaDescription:
			"if you're new, start here. see what jake hatfield is learning about, thinking about, and working on.",
		readingTime: '5 mins.',
		// featuredImage: Avatar,
		// ogImage: Avatar,
		// ogImageSquare: Avatar,
	};
</script>

<SEO {...seoProps} />

<section class="md:flex md:items-start md:justify-between">
	<div class="mb-5 md:mb-0 md:w-2/3">
		<header>
			<p class="text-2xl"><span role="img" aria-label="Waving emoji">👋</span> howdy, i'm</p>
			<h1 class="pt-3 text-3xl font-black">jake hatfield</h1>
		</header>
		<p class="mt-5">
			i'm a self-taught full-stack software engineer running a bootstrapped solo business.
		</p>
		<p class="mt-3">i want to design and build digital products like other people play piano.</p>
		<p class="mt-3">
			i created this site to share what <Link href="/changelogs" isUnderlined title="thoughts" />, <Link
				href="/articles"
				isUnderlined
				title="learnings"
			/>, and <Link href="/projects" isUnderlined title="projects" /> are currently taking my time and
			attention.
		</p>
	</div>
	<Image
		alt="jake hatfield"
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
<Recent type="changelogs" items={changelogs} />
<Recent type="articles" items={articles} />
<Recent type="projects" items={projects} />
