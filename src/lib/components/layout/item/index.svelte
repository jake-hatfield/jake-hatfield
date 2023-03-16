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

<li class="mt-5">
	<header>
		<h2 class="text-2xl font-black">
			{title}
		</h2>
		<Header {item} />
		<p class="mt-3">> {description}</p>
	</header>
	<p class="mt-3">
		{excerpt}...
	</p>
	<Link class="mt-3" {href} icon={ArrowRight} isUnderlined title={`view ${type.slice(0, -1)}`} />
</li>
