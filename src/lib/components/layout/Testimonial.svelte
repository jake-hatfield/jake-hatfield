<script lang="ts">
	export let author: string;
	export let featured = false;
</script>

<figure class={featured ? 'testimonial-featured' : 'testimonial-secondary'}>
	<blockquote class="text-neutral-200 {featured ? 'text-lg leading-8' : 'text-base leading-7'}">
		<slot name="content" />
	</blockquote>
	<figcaption class="mono mt-4 text-sm text-neutral-400">
		<cite class="not-italic text-neutral-200">{author}</cite>
	</figcaption>
</figure>
