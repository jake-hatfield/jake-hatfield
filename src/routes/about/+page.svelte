<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import { future, nonTechnical, technical } from '$lib/metadata/skills';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ projects } = data);
</script>

<SEO
	title="About"
	metaDescription="Learn a little about Jake Hatfield's story and see what skills he uses to build projects."
/>

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">About</h1>
	</header>
	<p class="mt-5">
		I'm a self-taught full-stack engineer and I wrote my first line of code in '19. I created this
		site to share what <Link href="/articles" isUnderlined title="thoughts" />, <Link
			href="/changelogs"
			isUnderlined
			title="learnings"
		/>, and <Link href="/projects" isUnderlined title="projects" /> are currently taking my time and
		attention.
	</p>
	<p class="mt-3">
		Most of my experiences have been trial-by-fire as I solo-bootstrapped a business in '20 that has
		evolved from a spreadsheet with custom macros into an entire suite of tools.
	</p>
	<p class="mt-3">
		I'm still here ~{new Date().getFullYear() - 2020} years later, thanks mostly to trusty old Google
		and the deep desire not to make the same mistake twice
		<span role="img" aria-label="Sweat smile emoji">😅</span>.
	</p>
	<p class="mt-3">
		I graduated from Texas A&M in '16 with a B.S. in Biology that I would love to use in conjunction
		with programming one day. Whether that will ever happen is TBD.
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
		<mark
			>I'm trying to refine my ability as a software engineer by creating and publishing a project
			for each letter of the alphabet. Right now I'm on "{String.fromCharCode(
				96 + projects.length,
			).toUpperCase()}."</mark
		>
	</p>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My technologies</h2>
	</header>
	<ul class="arrow-list">
		{#each technical as skill}
			<li>{skill}</li>
		{/each}
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My non-technical skills</h2>
	</header>
	<ul class="arrow-list">
		{#each nonTechnical as skill}
			<li>{skill}</li>
		{/each}
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">
			<Link class="mt-1.5" href="/uses" isUnderlined title="My tools" />
		</h2>
	</header>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My future learning interests</h2>
	</header>
	<ul class="arrow-list">
		{#each future as skill}
			<li>{skill}</li>
		{/each}
	</ul>
</section>
