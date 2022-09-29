<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import Image from '$components/utilities/Image.svelte';

	// icons
	import { ArrowRight } from 'carbon-icons-svelte';

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

<section class="mt-content md:flex md:items-start md:justify-between">
	<div class="md:w-1/2">
		<header>
			<p class="text-2xl"><span role="img" aria-label="Waving emoji">👋</span> howdy, i'm</p>
			<h1 class="pt-3 text-3xl font-black">jake hatfield</h1>
		</header>
		<p class="mt-5">
			i'm a self-taught full-stack software engineer running a bootstrapped solo business.
		</p>
		<p class="mt-3">this site exists to share what i'm currently learning and working on.</p>
		<Button
			class="mt-5"
			href="/changelog"
			icon={ArrowRight}
			kind="secondary"
			title="follow my journey" />
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
recent articles recent journals recent projects
<section>TEST</section>
