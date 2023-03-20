<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import metadata from '$lib/metadata';
</script>

<SEO title="Resume" metaDescription="See what tools Jake Hatfield uses to create projects." />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">Resume</h1>
	</header>
	<p class="mt-5">
		<Link
			href="https://drive.google.com/file/d/181jF9VSeF9JlfzDUQ39IqnUIcSLplolz/view?usp=share_link"
			isExternal
			isUnderlined
			title="View my public resume"
		/> or <Link href={`mailto:${metadata.email}`} isExternal isUnderlined title="contact me" /> for a
		version with links to code in some of my private repos.
	</p>
</section>
