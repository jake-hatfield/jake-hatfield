<script lang="ts">
	// components
	import Animated from '$components/layout/Animated.svelte';

	// * required props *
	export let item: { icon: any; title: string };
</script>

<Animated class="h-[24px]">
	<li class="flex items-center">
		<svelte:component this={item.icon} height={24} width={24} /><span class="ml-3"
			>{item.title}</span
		>
	</li>
</Animated>
