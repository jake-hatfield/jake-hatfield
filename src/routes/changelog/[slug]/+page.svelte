<script lang="ts">
	// types
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ page } = data);
</script>

<svelte:component this={page} />
