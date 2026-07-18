<script lang="ts">
	export let alt: string;
	export let height: number;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let maxWidth: string = '832px';
	export let placeholder: string | undefined = undefined;
	export let sizes: string = `(max-width: ${maxWidth}) 100vw, ${maxWidth}`;
	export let sources: { srcset: string; type: string }[];
	export let src: string;
	export let style: string = '';
	export let width: number;

	$: isEager = loading === 'eager';
</script>

<picture class={`max-w-full ${$$props.class ? $$props.class : ''}`}>
	{#each sources as source}
		{#if isEager}
			<source {sizes} srcset={source.srcset} type={source.type} {width} {height} />
		{:else}
			<source data-sizes={sizes} data-srcset={source.srcset} type={source.type} {width} {height} />
		{/if}
	{/each}
	<img
		class="{isEager ? '' : 'lazy'} border-2 border-violet-700 object-cover"
		{alt}
		{loading}
		decoding="async"
		{width}
		{height}
		src={isEager ? src : (placeholder ?? src)}
		{...isEager ? {} : { 'data-src': src }}
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
