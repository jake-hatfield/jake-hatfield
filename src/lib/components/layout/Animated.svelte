<script lang="ts">
	// svelte
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	// app
	import { browser } from '$app/environment';

	// packages
	import { inview } from 'svelte-inview';

	// lib
	import { clamp } from '$lib/utilities/number';

	// state
	let isInView: boolean;
	let prefersReducedMotion = true;

	if (browser) {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
</script>

<div
	use:inview={{ unobserveOnEnter: true, rootMargin: '-50px' }}
	on:change={({ detail }) => {
		isInView = detail.inView;
	}}
>
	{#if isInView || prefersReducedMotion}
		{#if prefersReducedMotion}
			<slot />
		{:else}
			<div
				in:fade|local={{
					delay: 300,
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
