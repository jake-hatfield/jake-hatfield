<script lang="ts">
	export let alt: string;
	export let height: number;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let maxWidth: string = '832px';
	export let placeholder: string;
	export let sizes: string = `(max-width: ${maxWidth}) 100vw, ${maxWidth}}`;
	export let sources: { srcset: string; type: string }[];
	export let src: string;
	export let style: string = '';
	export let width: number;
</script>

<picture class={`max-w-full ${$$props.class ? $$props.class : ''}`}>
	{#each sources as source}
		<source data-sizes={sizes} data-srcset={source.srcset} type={source.type} {width} {height} />
	{/each}
	<img
		class="lazy border-2 border-violet-700"
		{alt}
		{loading}
		decoding="async"
		{width}
		{height}
		data-src={src}
		src={placeholder}
		style={`${style}`} />
</picture>

<style>
	img {
		height: auto;
	}
	img:not([src]):not([srcset]) {
		visibility: hidden;
	}
</style>
