<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// lib
	import { formatIsoToText } from '$lib/utilities/dateTime';
	import { kebabCase } from '$lib/utilities/string';

	// icons
	import { Calendar, Tag, Time } from 'carbon-icons-svelte';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ createdAt, readingTime, tags, updatedAt } = item);
</script>

<div class="mt-3 md:flex md:items-center">
	{#if tags.length > 0}
		<div class="flex items-center">
			<Tag class="flex-none text-orange-400" />
			<ul class="ml-3 flex items-center">
				{#each tags as tag}
					<li class="ml-1.5 first:ml-0">
						<Button kind="secondary" href={`/tag/${kebabCase(tag)}`} size="sm" title={tag} />
					</li>
				{/each}
			</ul>
		</div>
	{/if}
	<div class={`${tags.length > 0 ? 'mt-3 md:mt-0 md:ml-3' : ''} flex items-center`}>
		<Time class="flex-none text-orange-400" />
		<p class="ml-3">{readingTime}</p>
	</div>
	<div class="flex items-end">
		<div class="mt-3 flex items-center md:mt-0 md:ml-3">
			<Calendar class="flex-none text-orange-400" />
			<time class="ml-3" datetime={createdAt}>{formatIsoToText(createdAt)}</time>
		</div>
		<p class="ml-3 text-zinc-500">
			{#if updatedAt && updatedAt > createdAt}updated {:else}published{/if}
		</p>
	</div>
</div>
