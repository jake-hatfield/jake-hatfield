<script lang="ts">
	// svelte
	import { quadInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	// packages
	import { inview } from 'svelte-inview';

	// lib
	import { clamp } from '$lib/utilities/number';

	// state
	let isInView: boolean;
</script>

<div
	use:inview={{ unobserveOnEnter: true, rootMargin: '-50px' }}
	on:change={({ detail }) => {
		isInView = detail.inView;
	}}
>
	{#if isInView}
		<div
			in:fade|local={{
				delay: clamp(Math.floor(Math.random() * 1000), 300, 350),
				duration: 350,
				easing: quadInOut,
			}}
		>
			<slot />
		</div>
	{:else}
		<div class={$$props.class ? $$props.class : ''} />
	{/if}
</div>
