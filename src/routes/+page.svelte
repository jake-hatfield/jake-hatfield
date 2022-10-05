<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';
	import Item from '$components/layout/item/index.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/SEO.svelte';

	// images
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.jpeg?width=832;268&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.jpeg?width=832;268&srcset';
	import Avatar from '$assets/images/rasters/avatar.jpeg?width=832';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ articles, changelogs, imagePlaceholders, projects } = data);
</script>

<SEO
	title="home"
	metaDescription="if you're new, start here. see what I'm learning about, thinking about, and working on." />

<section class="md:flex md:items-start md:justify-between">
	<div class="md:w-3/5">
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
				title="learnings" />, and <Link href="/projects" isUnderlined title="projects" /> are currently
			taking my time and attention.
		</p>
	</div>
	<Image
		alt="jake hatfield"
		class="md:ml-8 md:w-2/5"
		height={300}
		loading="eager"
		placeholder={imagePlaceholders[0]}
		sources={[
			{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
			{ srcset: AvatarSrcset, type: 'image/png' },
		]}
		src={Avatar}
		width={268} />
</section>

<section class="mt-8">
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h2 class="text-2xl font-black">recent changelogs</h2>
	</header>
	<ul>
		{#each changelogs as item}
			<Item {item} />
		{/each}
	</ul>
</section>

<section class="mt-8">
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h2 class="text-2xl font-black">recent articles</h2>
	</header>
	<ul>
		{#each articles as item}
			<Item {item} />
		{/each}
	</ul>
</section>

<section class="mt-8">
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h2 class="text-2xl font-black">recent projects</h2>
	</header>
	<ul>
		{#each projects as item}
			<Item {item} />
		{/each}
	</ul>
</section>
