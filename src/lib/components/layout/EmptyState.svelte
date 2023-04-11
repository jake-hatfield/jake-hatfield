<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// types
	import type { EmptyState } from '$types/EmptyState';

	// * required props *
	export let emptyState: EmptyState;

	const { description, icon, title } = emptyState;
</script>

<div class={`mt-5 mx-auto ${$$props.class ? $$props.class : ''}`}>
	<svelte:component this={icon} class="h-10 text-orange-400" />
	<h5 class="mt-3 text-lg font-black">{title}</h5>
	<p class="mt-0.5 text-neutral-200">
		{description}
	</p>
	{#if emptyState?.button}
		<Button
			class="mt-5"
			href={emptyState.button.href}
			icon={emptyState.button.icon}
			isFullWidth
			kind="secondary"
			onClick={emptyState.button.onClick}
			title={emptyState.button.title}
		/>
	{/if}
</div>
