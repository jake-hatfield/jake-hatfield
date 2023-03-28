<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// lib
	import { isDevEnv } from '$lib/metadata';

	// stores
	import { page } from '$app/stores';
</script>

<section class="content-section-text mt-content">
	<header class="text-center">
		<img
			class="mx-auto mt-8 w-full border-2 border-violet-700"
			src="/silicon-valley-error.gif"
			alt="Silicon Valley error gif"
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
		<p class="mx-auto mt-3 text-lg text-zinc-300 sm:mt-5 sm:max-w-xl">
			{#if $page.status === 404}
				Sorry, I couldn't find what you're looking for
			{:else if isDevEnv()}
				{$page.error?.message}
			{:else}
				Please try again later
			{/if} <span role="img" aria-label="Sweat smile emoji">😅</span>
		</p>
		<Button class="mx-auto mt-3" href="/" kind="secondary" title="Back to home" />
	</header>
</section>
