<script lang="ts">
	// svelte
	import { onMount } from 'svelte';

	// packages
	import lazyload, { type ILazyLoadInstance } from 'vanilla-lazyload';

	// app
	import { browser } from '$app/environment';

	// components
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';

	// styles
	import '$assets/app.css';
	import '@fontsource/ibm-plex-sans';
	import '@fontsource/ibm-plex-mono';
	import '@fontsource/permanent-marker';

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
</script>

<div class="pattern relative flex h-full min-h-screen flex-col items-start">
	<Header />

	<main class="relative h-full w-full">
		<slot />
	</main>

	<Footer />
</div>
