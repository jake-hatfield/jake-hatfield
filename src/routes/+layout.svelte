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

	// TODO<Jake>: Related items
	// TODO<Jake>: Images for items for SEO only
	// >TODO<Jake>: RSS<
	// TODO<Jake>: Email signup
	// TODO<Jake>: Favicon
	// TODO<Jake>: Image error
	// TODO<Jake>: 301 redirects for jacobhatfield.com & jakehatfield.com
	// 👆 in progress. netlify support has been contacted for jacobhatfield.com. jakehatfield.com & jake-hatfield.com can't be transferred out of namecheap until 60 days since they've been created
</script>

<div
	class="relative mx-auto flex h-full min-h-screen w-full flex-col items-start px-4 sm:px-6 md:max-w-3xl lg:px-8">
	<Header />

	<main class="mb-content mt-content relative h-full w-full">
		<slot />
	</main>

	<Footer />
</div>
