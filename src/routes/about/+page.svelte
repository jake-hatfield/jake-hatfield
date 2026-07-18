<script lang="ts">
	import Item from '$routes/about/Item.svelte';
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Testimonials from '$components/layout/Testimonials.svelte';

	import { futureLearning, skillCategories } from '$lib/metadata/skills';
	import { getPageSeoProps } from '$lib/metadata/seo';

	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ projects } = data);

	const title = 'About';
	const slug = 'about';
	const seoProps = getPageSeoProps({
		metaDescription:
			"Learn about Jake Hatfield's story and see what skills he uses to build projects.",
		slug,
		title,
	});
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="header text-3xl font-black">About</h1>
	</header>
	<p class="mt-5 text-neutral-200">
		I'm a self-taught full-stack engineer and I wrote my first line of code in '19. I created this
		site to share what <Link href="/projects" isUnderlined title="work" />, <Link
			href="/changelogs"
			isUnderlined
			title="learnings"
		/>, and <Link href="/articles" isUnderlined title="writing" /> are currently taking my time and
		attention.
	</p>
	<p class="mt-3 text-neutral-300">
		Most of my experiences have been trial-by-fire as I solo-bootstrapped a business called <Link
			href="/projects/leadgeek-v2"
			isUnderlined
			title="Leadgeek"
		/> in '20 that has evolved from a spreadsheet with custom macros into an entire suite of tools.
	</p>
	<p class="mt-3 text-neutral-300">
		I'm still here ~{new Date().getFullYear() - 2020} years later, thanks mostly to trusty old Google
		and the deep desire not to make the same mistake twice
		<span role="img" aria-label="Sweat smile emoji">😅</span>.
	</p>
	<p class="mt-3 text-neutral-300">
		I picked up programming as a necessity for building products and was surprised to find that I
		fell in love with it. Through trial-and-error, I've become well-versed in the development
		requirements of modern applications.
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

<Testimonials />

{#each skillCategories as category}
	<section class="mt-content">
		<header class="border-b-2 border-neutral-900 pb-1.5">
			<h2 class="header text-2xl font-black">{category.title}</h2>
		</header>
		<ul class="skill-grid">
			{#each category.skills as item}
				<Item {item} />
			{/each}
		</ul>
	</section>
{/each}

<section class="mt-content">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="header text-2xl font-black">On the horizon</h2>
	</header>
	<p class="mt-5 text-neutral-300">
		I'm exploring {futureLearning.join(' and ')} next — mostly out of curiosity about performance,
		concurrency, and whether the grass is actually greener.
	</p>
</section>

<section class="mt-content">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="header text-2xl font-black">
			<Link href="/uses" isUnderlined title="My tools" />
		</h2>
	</header>
	<p class="mt-5 text-neutral-300">
		Curious about the desk, apps, and services behind the work? The Uses page has the full rundown.
	</p>
</section>
