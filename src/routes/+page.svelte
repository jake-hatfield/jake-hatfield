<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';

	// images
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.png?width=1024;512&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.png?width=1024;512&srcset';
	import Avatar from '$assets/images/rasters/avatar.png?width=1024';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ imagePlaceholders } = data);
</script>

<div class="content-section">
	<header>
		<h1 class="py-3 text-3xl font-black">Howdy</h1>
	</header>
	<Image
		alt="Jake Hatfield"
		class="md:ml-8 md:w-1/2"
		height={500}
		loading="eager"
		placeholder={imagePlaceholders[0]}
		sources={[
			{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
			{ srcset: AvatarSrcset, type: 'image/png' },
		]}
		src={Avatar}
		width={500} />
</div>
