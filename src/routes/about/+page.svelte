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
	<header class="border-b-2 border-zinc-800 pb-1.5">
		<h1 class="text-3xl font-black">About</h1>
	</header>
	<p class="mt-5">
		I'm Jake Hatfield. I'm a self-taught full-stack engineer and I wrote my first line of code in
		nov '19. I created this site to share what <Link
			href="/changelogs"
			isUnderlined
			title="thoughts"
		/>, <Link href="/articles" isUnderlined title="learnings" />, and <Link
			href="/projects"
			isUnderlined
			title="projects"
		/> are currently taking my time and attention.
	</p>
	<p class="mt-3">
		Most of my experiences have been trial-by-fire as I bootstrapped a <Link
			href="https://leadgeek.io/vs/online-arbitrage-sourcing-list"
			isExternal
			isUnderlined
			title="online arbitrage sourcing list"
		/> in '20 that has evolved from a spreadsheet with custom macros into an entire suite of tools.
	</p>
	<p class="mt-3">
		I'm still here {new Date().getFullYear() - 2020}+ years later, thanks mostly to trusty old
		Google and the deep desire not to make the same idiotic mistake twice
		<span role="img" aria-label="Sweat smile emoji">😅</span>.
	</p>
	<p class="mt-3">
		I graduated from Texas A&M in '16 with a B.S. in Biology that I would love to use in conjunction
		with programming one day. Whether that will ever happen is TBD.
	</p>
	<p class="mt-3">
		I now live in Houston, Texas with my wife <span role="img" aria-label="Woman emoji">👩</span>,
		our daughter
		<span role="img" aria-label="Baby emoji">👶</span>, and our dog
		<span role="img" aria-label="Dog emoji">🐕</span>.
	</p>
	<p class="mt-3">
		I picked up programming as a necessity for product development and was surprised to find that I
		fell in love with it.
	</p>
	{#if projects && projects.length > 0}
		<p class="mt-3">
			Now I'm trying to refine this skill by creating <i>and </i> publishing a project for every
			letter of the alphabet. Right now I'm on "{String.fromCharCode(96 + projects.length)}."
		</p>
	{/if}
	<p class="mt-3">
		Through trial-and-error, I've become well-versed in the development requirements of modern
		applications.
	</p>
	<p class="mt-3">
		I can handle authentication, process payments, send emails, preserve data in storage, and plug
		that all into a responsive, accessible, and intuitive front end.
	</p>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My technologies</h2>
	</header>
	<ul class="pl-5 md:pl-8">
		{#each technical as skill}
			<li class="mt-1.5 list-disc">{skill}</li>
		{/each}
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My non-technical skills</h2>
	</header>
	<ul class="pl-5 md:pl-8">
		{#each nonTechnical as skill}
			<li class="mt-1.5 list-disc">{skill}</li>
		{/each}
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">My future learning interests</h2>
	</header>
	<ul class="pl-5 md:pl-8">
		{#each future as skill}
			<li class="mt-1.5 list-disc">{skill}</li>
		{/each}
	</ul>
</section>
