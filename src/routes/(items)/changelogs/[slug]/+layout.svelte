<script lang="ts">
	// packages
	import { DateTime } from 'luxon';

	// components
	import Button from '$components/utilities/Button.svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';

	// types
	import type { LayoutData } from '.svelte-kit/types/src/routes/$types';

	// props
	export let data: LayoutData;
	$: ({ changelog } = data);

	// TODO<Jake>: Create a header section
	// TODO<Jake>: Related posts
</script>

<section class="content-section-text">
	<article id="content-markdown" itemscope itemtype="http://schema.org/Article">
		<header>
			<h1 class="mono inline-block text-2xl font-black md:text-4xl">
				{changelog.title}
			</h1>
			<p class="mt-5">
				Last updated: <date datetime={changelog.date}>
					{DateTime.fromISO(changelog.date).toFormat('LLLL dd, yyyy')}
				</date>
			</p>
			<div class="mt-1.5">{changelog.readingTime}</div>
			<ul class="md:flex md:flex-wrap md:items-center">
				{#each changelog.tags as tag}
					<li class="mt-3 bg-cyan-500 text-center text-sm first:ml-0 md:ml-3">
						<Button
							href={`/blog/tags/${kebabCase(tag.toString())}`}
							isFullWidth
							kind="secondary"
							size="sm"
							title={tag.toString()} />
					</li>
				{/each}
			</ul>
		</header>
		<div class="cover-image">
			<!-- <Image path="posts/{post.slug}" filename="cover" alt="Cover Image" /> -->
		</div>
		<div class="content">
			<slot />
		</div>
	</article>
</section>

{#if changelog.relatedPosts && changelog.relatedPosts.length > 0}
	<ul class="content-section mb-content">
		{#each changelog.relatedPosts as rel}
			<li
				class="ml-6 h-72 w-56 min-w-[225px] overflow-hidden border-2 border-transparent bg-zinc-800 text-white transition duration-150 first:ml-0 hover:border-rose-600">
				{rel.title}
			</li>
		{/each}
	</ul>
{/if}
