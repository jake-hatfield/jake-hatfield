<script lang="ts">
	// lib
	import {
		getItemImagePath,
		getItemImageSrcset,
		itemImageSizes,
	} from '$lib/utilities/image/itemHero';

	export let alt: string;
	export let image: string;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let imageClass = 'h-64 lg:h-80';
</script>

<picture class={$$props.class ? $$props.class : ''}>
	<source
		sizes={itemImageSizes}
		srcset={getItemImageSrcset(image)}
		type="image/webp"
	/>
	<img
		class={`w-full border-b-2 border-neutral-800 object-cover duration-500 group-hover:scale-110 ${imageClass}`}
		decoding="async"
		src={getItemImagePath(image)}
		{alt}
		{loading}
	/>
</picture>
