<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';

	// props
	export let href: string;
	export let title: string;
	export let type: string;
</script>

<li class="mt-5">
	<h3 class="flex items-center">
		<p>{type}:</p>
		<Link class="ml-1.5" {href} isExternal isUnderlined {title} />
	</h3>
	<slot name="description" />
</li>
