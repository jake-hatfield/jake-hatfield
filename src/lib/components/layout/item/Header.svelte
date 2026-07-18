<script lang="ts">
	import Button from '$components/utilities/Button.svelte';
	import Link from '$components/utilities/Link.svelte';

	import { formatIsoToText } from '$lib/utilities/dateTime';
	import { kebabCase } from '$lib/utilities/string';

	import metadata from '$lib/metadata';

	import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
	import LinkIcon from 'carbon-icons-svelte/lib/Link.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import Tag from 'carbon-icons-svelte/lib/Tag.svelte';
	import Time from 'carbon-icons-svelte/lib/Time.svelte';

	import type { FinalizedItem } from '$types/markdown/Item';

	export let item: FinalizedItem;

	$: ({ createdAt, hiddenRepo, readingTime, repository, site, tag, updatedAt } = item);
</script>

<div class="mono mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-400">
	{#if tag}
		<div class="flex items-center">
			<Tag class="flex-none text-orange-400" size={18} />
			<Button
				class="ml-2"
				kind="secondary"
				href={`/tags/${kebabCase(tag)}`}
				size="sm"
				title={tag}
			/>
		</div>
	{/if}
	<div class="flex items-center">
		<Time class="flex-none text-orange-400" size={18} />
		<span class="ml-2">{readingTime}</span>
	</div>
	<div class="flex items-center">
		<Calendar class="flex-none text-orange-400" size={18} />
		<time class="ml-2" datetime={updatedAt ? updatedAt : createdAt}
			>{formatIsoToText(updatedAt ? updatedAt : createdAt)}</time
		>
	</div>
	{#if repository || hiddenRepo}
		<div class="flex items-center">
			<LogoGithub class="flex-none text-orange-400" size={18} />
			<Link
				class="ml-2"
				href={hiddenRepo
					? `mailto:${metadata.email}?subject=Private%20Repo%20Access%20Request`
					: repository}
				isExternal
				isUnderlined
				title={hiddenRepo ? 'Request repo access' : 'Repository'}
			/>
		</div>
	{/if}
	{#if site}
		<div class="flex items-center">
			<LinkIcon class="flex-none text-orange-400" size={18} />
			<Link class="ml-2" href={site} isExternal isUnderlined title="Live site" />
		</div>
	{/if}
</div>
