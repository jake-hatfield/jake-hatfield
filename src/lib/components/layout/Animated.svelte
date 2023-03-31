<script lang="ts">
	// svelte
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
	on:inview_init={(event) => {
		const { observer, node } = event.detail;
		console.log(observer);
	}}
>
	{#if isInView}
		<div
			in:fade|local={{ delay: clamp(Math.floor(Math.random() * 1000), 300, 600), duration: 350 }}
		>
			<slot />
		</div>
	{:else}
		<div class={$$props.class ? $$props.class : ''} />
	{/if}
</div>
