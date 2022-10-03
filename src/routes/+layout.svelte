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

	// TODO<Jake>: Create tag system
	// TODO<Jake>: Excerpt from articles
	// TODO<Jake>: Related items
	// TODO<Jake>: Recent articles, projects, and changelogs on home page
	// TODO<Jake>: Images for items for SEO only
	// TODO<Jake>: RSS
	// TODO<Jake>: Email signup
	// TODO<Jake>: Mobile optimizations
</script>

<div
	class="relative mx-auto flex h-full min-h-screen w-full max-w-3xl flex-col items-start px-4 sm:px-6 lg:px-8">
	<Header />

	<main class="mb-content mt-content relative h-full w-full">
		<slot />
	</main>

	<Footer />
</div>
