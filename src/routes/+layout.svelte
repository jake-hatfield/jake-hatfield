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

	// TODO<Jake>: Fix OG templates - https://www.opengraph.xyz/url/https%3A%2F%2Fceea6f2d1895.ngrok.io
	// TODO<Jake>: Images for items for SEO only -- fix RSS images
	// TODO<Jake>: ImprovMX for new domains
	// TODO<Jake>: Error page
</script>

<div
	class="relative mx-auto flex h-full min-h-screen w-full flex-col items-start px-4 sm:px-6 md:max-w-3xl lg:px-8"
>
	<Header />
	<main class="mb-content mt-content relative h-full w-full">
		<slot />
	</main>
	<Footer />
</div>
