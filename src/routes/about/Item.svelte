<script lang="ts">
	// components
	import Animated from '$components/layout/Animated.svelte';

	import type { ComponentType, SvelteComponent } from 'svelte';

	type SkillIcon = ComponentType<SvelteComponent<{ height?: number; width?: number }>>;

	type SkillItem = {
		icon: () => Promise<{ default: SkillIcon }>;
		title: string;
	};

	// * required props *
	export let item: SkillItem;
</script>

<Animated>
	<li class="flex items-center">
		{#await item.icon() then module}
			<svelte:component this={module.default} height={24} width={24} />
		{/await}
		<span class="ml-3">{item.title}</span>
	</li>
</Animated>
