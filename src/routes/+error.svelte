<script lang="ts">
	import Button from '$components/utilities/Button.svelte';
	import { isDevEnv } from '$lib/metadata';
	import { page } from '$app/stores';
</script>

<section class="content-section-text mt-content">
	<header class="text-center">
		<video
			class="mx-auto mt-8 w-full max-w-md border-2 border-violet-700 motion-reduce:hidden"
			autoplay
			loop
			muted
			playsinline
			poster="/silicon-valley-error.webp"
		>
			<source src="/silicon-valley-error.mp4" type="video/mp4" />
		</video>
		<img
			alt=""
			class="mx-auto mt-8 hidden w-full max-w-md border-2 border-violet-700 motion-reduce:block"
			src="/silicon-valley-error.webp"
		/>
		<p class="content-uppercase mt-8 text-lime-400">{$page.status}</p>
		<h1 class="primary-header mt-3">
			{#if $page.status === 404}
				{#if $page.error?.message}
					{$page.error.message}
				{:else}
					This page does not exist
				{/if}
			{:else if $page.status >= 500}
				Something went wrong with my servers
			{:else}
				Something went wrong
			{/if}
		</h1>
		<p class="mx-auto mt-3 text-lg text-neutral-300 sm:mt-5 sm:max-w-xl">
			{#if $page.status === 404}
				Sorry, I couldn't find what you're looking for
			{:else if isDevEnv()}
				{$page.error?.message}
			{:else}
				Please try again later
			{/if}
			<span role="img" aria-label="Sweat smile emoji">😅</span>
		</p>
		<Button class="mx-auto mt-3" href="/" kind="secondary" title="Back to home" />
	</header>
</section>
