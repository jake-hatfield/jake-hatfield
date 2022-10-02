<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import { Calendar, Tag, Time } from 'carbon-icons-svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';
	import { formatIsoToText } from '$lib/utilities/dateTime';

	// types
	import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

	// props
	export let data: LayoutData;
	$: ({ item } = data);
</script>

<section class="content-section-text">
	<article id="content-markdown" itemscope itemtype="http://schema.org/Article">
		<header>
			<h1 class="inline-block text-2xl font-black md:text-3xl">
				{item.title}
			</h1>
			<div class="mt-3 flex items-center">
				<div class="flex items-center">
					<Tag class="text-orange-400" />
					<ul class="ml-3 flex items-center">
						{#each item.tags as tag}
							<li class="ml-1.5 first:ml-0">
								<Button kind="secondary" href={`/tags/${kebabCase(tag)}`} size="sm" title={tag} />
							</li>
						{/each}
					</ul>
				</div>
				<span class="mx-3">|</span>
				<div class="flex items-center">
					<Time class="text-orange-400" />
					<p class="ml-3">{item.readingTime}</p>
				</div>
				<span class="mx-3">|</span>
				<div class="flex items-center">
					<Calendar class="text-orange-400" />
					<p class="ml-3">{formatIsoToText(item.createdAt)}</p>
				</div>
				<p class="ml-3 text-zinc-500">
					{#if item.updatedAt && item.updatedAt > item.createdAt}updated
					{:else}published{/if}
				</p>
			</div>
		</header>
		<div class="cover-image">
			<!-- <Image path="posts/{post.slug}" filename="cover" alt="Cover Image" /> -->
		</div>
		<div class="content">
			<slot />
		</div>
	</article>
</section>

{#if item.relatedPosts && item.relatedPosts.length > 0}
	<ul class="content-section mb-content">
		{#each item.relatedPosts as rel}
			<li
				class="ml-6 h-72 w-56 min-w-[225px] overflow-hidden border-2 border-transparent bg-zinc-800 text-white transition duration-150 first:ml-0 hover:border-rose-600">
				{rel.title}
			</li>
		{/each}
	</ul>
{/if}
