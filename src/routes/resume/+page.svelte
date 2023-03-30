<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';

	// lib
	import metadata from '$lib/metadata';

	// seo
	const title = 'Resume';
	const slug = 'resume';
	const seoProps = {
		breadcrumbs: [{ title, slug }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription:
			"View Jake Hatfield's public resume or get in contact for a more detailed one containing links to private Github repos.",
		readingTime: '5 mins.',
		slug,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">Resume</h1>
	</header>
	<p class="mt-5">
		<Link
			href="https://drive.google.com/file/d/14IkwU_M2ZpdjMFC4UxTndkxCqKtA1ZD5/view?usp=share_link"
			isExternal
			isUnderlined
			title="View my public resume"
		/> or <Link href={`mailto:${metadata.email}`} isExternal isUnderlined title="contact me" /> for a
		version with links to code in some of my private repos.
	</p>
</section>
