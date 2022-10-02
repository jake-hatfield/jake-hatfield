<script lang="ts">
	// lib
	import ReusableLayout from '$lib/layout/item/index.svelte';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
</script>

<ReusableLayout {data}>
	<slot />
</ReusableLayout>
