<script lang="ts">
	export let alt: string;
	export let image: string;
	export let loading: 'lazy' | 'eager' = 'lazy';
	export let imageClass = 'h-64 lg:h-80';
</script>

<img
	class={`w-full border-b-2 border-neutral-800 object-cover duration-500 group-hover:scale-110 ${imageClass} ${
		$$props.class ? $$props.class : ''
	}`}
	decoding="async"
	src={`/images/items/${image}`}
	{alt}
	{loading}
/>
