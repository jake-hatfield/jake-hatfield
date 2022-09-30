<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import Link from '$components/utilities/Link.svelte';

	// lib
	import { formatIsoToText } from '$lib/utilities/dateTime';
	import { kebabCase } from '$lib/utilities/string';

	// icons
	import { ArrowRight, Calendar, Tag, Time } from 'carbon-icons-svelte';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let article: FinalizedItem;

	// destructure props
	$: ({ createdAt, excerpt, readingTime, slug, tags, title, updatedAt } = article);

	$: href = `./articles/${slug}`;
</script>

<li class="mt-5">
	<header>
		<h2 class="text-2xl font-black">
			{title}
		</h2>
		<div class="mt-3 flex items-center">
			<div class="flex items-center">
				<Tag class="text-orange-400" />
				<ul class="ml-3 flex items-center">
					{#each tags as tag}
						<li class="ml-1.5 first:ml-0">
							<Button kind="secondary" href={`/tags/${kebabCase(tag)}`} size="sm" title={tag} />
						</li>
					{/each}
				</ul>
			</div>
			<span class="mx-3">|</span>
			<div class="flex items-center">
				<Time class="text-orange-400" />
				<p class="ml-3">{readingTime}</p>
			</div>
			<span class="mx-3">|</span>
			<div class="flex items-center">
				<Calendar class="text-orange-400" />
				<p class="ml-3">{formatIsoToText(createdAt)}</p>
			</div>
			<p class="ml-3 text-zinc-500">
				{#if updatedAt && updatedAt > createdAt}updated {:else}published{/if}
			</p>
		</div>
		<p class="mt-3">> {excerpt}</p>
	</header>

	<Link class="mt-3" {href} icon={ArrowRight} isUnderlined title="read article" />
</li>
