<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/SEO.svelte';

	// images
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.png?width=832;250&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.png?width=832;250&srcset';
	import Avatar from '$assets/images/rasters/avatar.png?width=832';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ imagePlaceholders } = data);
</script>

<SEO
	title="home"
	metaDescription="if you're new, start here. see what I'm learning about, thinking about, and working on." />

<section class="md:flex md:items-start md:justify-between">
	<div class="md:w-1/2">
		<header>
			<p class="text-2xl"><span role="img" aria-label="Waving emoji">👋</span> howdy, i'm</p>
			<h1 class="pt-3 text-3xl font-black">jake hatfield</h1>
		</header>
		<p class="mt-5">
			i'm a self-taught full-stack software engineer running a bootstrapped solo business.
		</p>
		<p class="mt-3">i want to design and build digital products like other people play piano.</p>
		<p class="mt-3">
			i created this site to share what <Link href="/articles" isUnderlined title="learnings" />, <Link
				href="/changelogs"
				isUnderlined
				title="thoughts" />, and <Link href="/projects" isUnderlined title="projects" /> are currently
			taking my time and attention.
		</p>
	</div>
	<Image
		alt="jake hatfield"
		class="md:ml-8 md:w-1/2"
		height={300}
		loading="eager"
		placeholder={imagePlaceholders[0]}
		sources={[
			{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
			{ srcset: AvatarSrcset, type: 'image/png' },
		]}
		src={Avatar}
		width={250} />
</section>

<section class="mt-8">recent articles recent journals recent projects</section>
