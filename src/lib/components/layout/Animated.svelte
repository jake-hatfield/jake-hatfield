<script lang="ts">
	// svelte
	import { onMount } from 'svelte';
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	// packages
	import { inview } from 'svelte-inview';

	// lib
	import { clamp } from '$lib/utilities/number';

	// state
	let isInView = false;
	let prefersReducedMotion = false;

	onMount(() => {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReducedMotion) {
			isInView = true;
		}
	});
</script>

<div
	use:inview={{ unobserveOnEnter: true, rootMargin: '-50px' }}
	oninview_change={({ detail }) => {
		isInView = detail.inView;
	}}
>
	{#if isInView}
		{#if prefersReducedMotion}
			<slot />
		{:else}
			<div
				in:fade|local={{
					delay: clamp(Math.floor(Math.random() * 1000), 300, 350),
					duration: 350,
					easing: quadInOut,
				}}
			>
				<slot />
			</div>
		{/if}
	{:else}
		<div class={$$props.class ? $$props.class : ''} aria-hidden="true"></div>
	{/if}
</div>
