<script lang="ts">
	// svelte
	import { afterUpdate, onMount } from 'svelte';

	// packages
	import { load, trackPageview } from 'fathom-client';
	import lazyload from 'vanilla-lazyload';

	// env
	import { PUBLIC_FATHOM_ID, PUBLIC_FATHOM_URL } from '$env/static/public';

	// app
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	// components
	import Footer from '$components/layout/Footer.svelte';
	import Header from '$components/layout/Header.svelte';

	// lib
	import { isDevEnv } from '$lib/metadata';

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
	// track a page view on route change
	$: browser && $page.url.pathname && trackPageview();

	onMount(() => {
		if (!isDevEnv()) {
			// load analytics
			load(PUBLIC_FATHOM_ID, {
				auto: false,
				honorDNT: true,
				url: PUBLIC_FATHOM_URL,
			});
		}
	});

	afterUpdate(() => {
		if (browser && lazyloadInstance) {
			lazyloadInstance.update();
		}
	});
</script>

<div class="relative mx-auto flex h-full min-h-screen w-full flex-col items-start">
	<Header />
	<main class="mt-content content-section relative h-full w-full">
		<slot />
	</main>
	<Footer />
</div>
