<script lang="ts">
	// svelte
	import { afterUpdate } from 'svelte';

	// packages
	import lazyload from 'vanilla-lazyload';

	// app
	import { browser } from '$app/environment';

	// components
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';

	// styles
	import '$assets/app.css';
	import '@fontsource/silkscreen';

	// types
	import type { ILazyLoadInstance } from 'vanilla-lazyload';

	// state
	let lazyloadInstance: ILazyLoadInstance | null = null;

	// reactive state
	$: if (browser && !lazyloadInstance)
		lazyloadInstance = new lazyload({
			elements_selector: '.lazy',
		});

	afterUpdate(() => {
		if (browser && lazyloadInstance) {
			lazyloadInstance.update();
		}
	});
</script>

<svelte:head>
	<script
		defer
		src="https://umami.doomscheme.com/script.js"
		data-website-id="1e037c3f-08ed-4a5f-8b08-daa496e50e95"></script>
</svelte:head>
<div class="relative mx-auto flex h-full min-h-screen w-full flex-col items-start">
	<Header />
	<main class="mt-content content-section relative h-full w-full">
		<slot />
	</main>
	<Footer />
</div>
