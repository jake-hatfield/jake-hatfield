<script lang="ts">
	// lib
	import { kebabCase } from '$lib/utilities/string';

	// props
	export let icon: any;
	export let title: string;
</script>

<a
	href={`./${kebabCase(title)}`}
	class="flex flex-col items-center rounded-sm p-3 transition-colors duration-150 hover:text-blue-400">
	<svelte:component this={icon} size={18} />
	<p class="mt-1.5">{title}</p>
</a>
