<script lang="ts">
	// components
	import Header from '$components/layout/item/Header.svelte';
	import Link from '$components/utilities/Link.svelte';

	// icons
	import { ArrowRight } from 'carbon-icons-svelte';

	// types
	import type { FinalizedItem, Types } from '$types/markdown/Item';

	// * required props *
	export let item: FinalizedItem;

	// destructure props
	$: ({ description, excerpt, slug, title, type } = item);

	$: href = `/${type}/${slug}`;
</script>

<li class="mt-5 border-2 border-neutral-900 p-5">
	<header>
		<h2 class="text-xl font-black">
			{title}
		</h2>
		<Header {item} />
		<p class="mt-3"><span class="text-orange-400">></span> {description}</p>
	</header>
	<p class="mt-3">
		{excerpt}...
	</p>
	<Link class="mt-5" {href} icon={ArrowRight} isUnderlined title={`View ${type}`} />
</li>
