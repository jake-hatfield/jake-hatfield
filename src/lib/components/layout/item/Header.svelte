<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';
	import Link from '$components/utilities/Link.svelte';

	// lib
	import { formatIsoToText } from '$lib/utilities/dateTime';
	import { kebabCase } from '$lib/utilities/string';

	// metadata
	import metadata from '$lib/metadata';

	// icons
	import Calendar from 'carbon-icons-svelte/lib/Calendar.svelte';
	import LinkIcon from 'carbon-icons-svelte/lib/Link.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import Tag from 'carbon-icons-svelte/lib/Tag.svelte';
	import Time from 'carbon-icons-svelte/lib/Time.svelte';

	// types
	import type { FinalizedItem } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ createdAt, hiddenRepo, readingTime, repository, site, tag, updatedAt } = item);
</script>

<div class="mt-5 text-neutral-200 md:flex md:items-center">
	{#if tag}
		<div class="flex items-center">
			<Tag class="mt-0.5 flex-none text-orange-400" size={20} />
			<Button
				class="ml-3"
				kind="secondary"
				href={`/tags/${kebabCase(tag)}`}
				size="sm"
				title={tag}
			/>
		</div>
	{/if}
	<div class={`${tag ? 'mt-3 md:mt-0 md:ml-3' : ''} flex items-center`}>
		<Time class="mt-0.5 flex-none text-orange-400" size={20} />
		<p class="ml-3">{readingTime}</p>
	</div>
	<div class="flex items-center">
		<div class="mt-3 flex items-start md:mt-0 md:ml-3">
			<Calendar class="mt-0.5 flex-none text-orange-400" size={20} />
			<time class="ml-3" datetime={updatedAt ? updatedAt : createdAt}
				>{formatIsoToText(updatedAt ? updatedAt : createdAt)}</time
			>
		</div>
	</div>
	{#if repository || hiddenRepo}
		<div class="flex items-center">
			<div class="mt-3 flex items-start md:mt-0 md:ml-3">
				<LogoGithub class="mt-0.5 flex-none text-orange-400" size={20} />
				<Link
					class="ml-3"
					href={hiddenRepo
						? `mailto:${metadata.email}?subject=Private%20Repo%20Access%20Request`
						: repository}
					isExternal
					isUnderlined
					title={hiddenRepo ? 'Request' : 'Repo'}
				/>
			</div>
		</div>
	{/if}
	{#if site}
		<div class="flex items-center">
			<div class="mt-3 flex items-start md:mt-0 md:ml-3">
				<LinkIcon class="mt-0.5 flex-none text-orange-400" size={20} />
				<Link class="ml-3" href={site} isExternal isUnderlined title="Website" />
			</div>
		</div>
	{/if}
</div>
