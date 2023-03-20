<script lang="ts">
	// icons
	import Launch from 'carbon-icons-svelte/lib/Launch.svelte';

	// types
	import type ProgressBarRound from 'carbon-icons-svelte/lib/ProgressBarRound.svelte';

	// * required props *
	export let href: string;
	export let title: string;

	// optional props
	export let ariaLabel = title;
	export let disabled = false;
	export let icon: typeof ProgressBarRound | null = null;
	export let isBlock = false;
	export let isExternal = false;
	export let isNoFollow = false;
	export let isUnderlined = false;
	export let onClick = () => {};

	if (icon && isExternal)
		throw new Error('Link component cannot have an icon and an isExternal status');
</script>

{#if disabled}
	<p
		aria-label={ariaLabel}
		class={`inline text-neutral-400 text-opacity-80 ${$$props.class ? $$props.class : ''}`}
	>
		<!-- putting these items on separate lines will create a space -->
		{title}{#if isExternal}
			<Launch size={16} class="ml-0.5 inline text-orange-400" />
		{:else if icon}
			<svelte:component this={icon} size={16} class="ml-0.5 inline text-orange-400" />
		{/if}
	</p>
{:else}
	<a
		aria-label={ariaLabel}
		class={`${isBlock ? 'block' : 'inline'} ${isUnderlined ? 'link-underline' : 'link'} ${
			icon || isExternal ? 'mr-0.5' : ''
		} ${$$props.class ? $$props.class : ''}`}
		{href}
		on:click={onClick}
		rel={isExternal ? 'noopener noreferrer' : isNoFollow ? 'nofollow' : null}
		target={isExternal ? '_blank' : null}
	>
		<!-- putting these items on separate lines will create a space -->
		{title}{#if isExternal}
			<Launch size={16} class="ml-0.5 inline text-orange-400" />
		{:else if icon}
			<svelte:component this={icon} size={16} class="ml-0.5 inline text-orange-400" />
		{/if}
	</a>
{/if}
