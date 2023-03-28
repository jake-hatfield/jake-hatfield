<script lang="ts">
	// svelte
	import { afterUpdate, onMount } from 'svelte';

	// packages
	import { load } from 'fathom-client';
	import lazyload from 'vanilla-lazyload';

	// env
	import { PUBLIC_FATHOM_ID, PUBLIC_FATHOM_URL } from '$env/static/public';

	// app
	import { browser } from '$app/environment';

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

	onMount(() => {
		if (!isDevEnv()) {
			// load analytics
			load(PUBLIC_FATHOM_ID, {
				url: PUBLIC_FATHOM_URL,
				auto: false,
			});
		}
	});

	afterUpdate(() => {
		if (browser && lazyloadInstance) {
			lazyloadInstance.update();
		}
	});

	// TODO<Jake>: Fix OG templates - https://www.opengraph.xyz/url/https%3A%2F%2Fceea6f2d1895.ngrok.io
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
