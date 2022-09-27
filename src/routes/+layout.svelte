<script lang="ts">
	// svelte
	import { onMount } from 'svelte';

	// packages
	import lazyload from 'vanilla-lazyload';

	// app
	import { browser } from '$app/environment';

	// components
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';

	// styles
	import '$assets/app.css';

	// types
	import type { ILazyLoadInstance } from 'vanilla-lazyload';

	// state
	let lazyloadInstance: ILazyLoadInstance | null = null;

	// reactive state
	$: if (browser && !lazyloadInstance) lazyloadInstance = new lazyload();

	// onMount
	onMount(() => {
		if (browser && lazyloadInstance) {
			lazyloadInstance.update();
		}
	});

	// initial popup for first-time users
	// links/modal for each launch button
</script>

<div class="pattern relative flex h-full min-h-screen flex-col items-start">
	<!-- <Header /> -->

	<main class="relative h-full w-full">
		<slot />
	</main>

	<!-- <Footer /> -->
</div>
