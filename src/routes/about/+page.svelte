<script lang="ts">
	// components
	import Item from '$routes/about/Item.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Social from '$components/layout/Social.svelte';

	// lib
	import { creative, future, technical } from '$lib/metadata/skills';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ projects } = data);

	// seo
	const title = 'About';
	const slug = 'about';
	const seoProps = {
		breadcrumbs: [{ title, slug }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription:
			"Learn about Jake Hatfield's story and see what skills he uses to build projects.",
		readingTime: '5 mins.',
		slug,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">About</h1>
	</header>
	<p class="mt-5">
		I'm a self-taught full-stack engineer and I wrote my first line of code in '19. I created this
		site to share what <Link href="/projects" isUnderlined title="projects" />, <Link
			href="/changelogs"
			isUnderlined
			title="learnings"
		/>, and <Link href="/articles" isUnderlined title="thoughts" /> are currently taking my time and
		attention.
	</p>
	<p class="mt-3">
		Most of my experiences have been trial-by-fire as I solo-bootstrapped a business called <Link
			href="/projects/leadgeek-v2"
			isUnderlined
			title="Leadgeek"
		/> in '20 that has evolved from a spreadsheet with custom macros into an entire suite of tools.
	</p>
	<p class="mt-3">
		I'm still here ~{new Date().getFullYear() - 2020} years later, thanks mostly to trusty old Google
		and the deep desire not to make the same mistake twice
		<span role="img" aria-label="Sweat smile emoji">😅</span>. Now that Leadgeek is highly
		maintainable on the side, I'm looking for my next challenging project.
	</p>
	<p class="mt-3">
		I picked up programming as a necessity for building products and was surprised to find that I
		fell in love with it. Through trial-and-error, I've become well-versed in the development
		requirements of modern applications.
	</p>
	<p class="mt-3">
		I can handle authentication, process payments, send emails, preserve data in storage, and plug
		that all into a responsive, accessible, and intuitive front end.
	</p>
	<p class="mt-3">
		I feel like my experience building products from scratch and selling them to real people has
		accelerated my learning and made me extremely well-rounded. At the same time, I've realized
		recently that I can only accomplish a finite amount building and marketing products by myself.
	</p>
	<p class="mt-3">
		Consequently, <mark
			>I'd like to contribute to a team of other software engineers who are solving meaningful
			problems on a bigger scale than I can accomplish completely on my own.</mark
		>
	</p>
	<p class="mt-3">
		<mark
			>I'm trying to refine my ability as a software engineer by creating and publishing a project
			for each letter of the alphabet. Right now I'm on "{String.fromCharCode(
				96 + projects.length,
			).toUpperCase()}."</mark
		>
	</p>
</section>
<section class="mt-content">
	<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">My socials</h2>
	</header>
	<Social />
</section>
<section class="mt-content">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">My technologies</h2>
	</header>
	<ul class="mt-5 grid gap-5 md:grid-cols-2">
		{#each technical as item}
			<Item {item} />
		{/each}
	</ul>
</section>
<section class="mt-content">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">My software</h2>
	</header>
	<ul class="mt-5 grid gap-5 md:grid-cols-2">
		{#each creative as item}
			<Item {item} />
		{/each}
	</ul>
</section>
<section class="mt-content">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">My future learning interests</h2>
	</header>
	<ul class="mt-5 grid gap-5 md:grid-cols-2">
		{#each future as item}
			<Item {item} />
		{/each}
	</ul>
</section>
<section class="mt-content">
	<header>
		<h2 class="text-2xl font-black">
			<Link class="mt-1.5" href="/uses" isUnderlined title="My tools" />
		</h2>
	</header>
</section>
