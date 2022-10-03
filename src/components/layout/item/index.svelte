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

	// optional props
	export let type: Types | 'item' = 'item';

	// destructure props
	$: ({ excerpt, slug, title } = item);

	$: href = `./${type}/${slug}`;
</script>

<li class="mt-5">
	<header>
		<h2 class="text-2xl font-black">
			{title}
		</h2>
		<Header {item} />
		<p class="mt-3">> {excerpt}</p>
	</header>
	<Link
		class="mt-3"
		{href}
		icon={ArrowRight}
		isUnderlined
		title={`view ${type === 'item' ? type : type.slice(0, -1)}`} />
</li>
