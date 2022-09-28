<script lang="ts">
	// icons
	import { Launch } from 'carbon-icons-svelte';

	// required props
	export let href: string;
	export let title: string;

	// other props
	export let disabled = false;
	export let icon: any | null = null;
	export let isBlock = false;
	export let isExternal = false;
	export let isUnderlined = false;
	export let onClick = () => {};
	export let ariaLabel = title;

	if (icon && isExternal)
		throw new Error('Link component cannot have an icon and an isExternal status');
</script>

{#if disabled}
	<p
		aria-label={ariaLabel}
		class={`flex text-zinc-500 text-opacity-80 ${$$props.class ? $$props.class : ''}`}>
		<span class="flex items-center">
			<span>
				{title}
			</span>
			{#if isExternal}
				<Launch size={16} class="ml-1.5" />
			{:else if icon}
				<svelte:component this={icon} size={16} class="ml-1.5" />
			{/if}
		</span>
	</p>
{:else}
	<a
		aria-label={ariaLabel}
		class={`${isBlock ? 'block' : 'inline-block'} ${isUnderlined ? 'link-underline' : 'link'} ${
			$$props.class ? $$props.class : ''
		}`}
		{disabled}
		{href}
		on:click={onClick}
		rel={isExternal ? 'noopener noreferrer' : null}
		target={isExternal ? '_blank' : null}>
		<span class="flex items-center">
			<span>
				{title}
			</span>
			{#if isExternal}
				<Launch size={16} class="ml-1.5 text-orange-400" />
			{:else if icon}
				<svelte:component this={icon} size={16} class="ml-1.5 text-orange-400" />
			{/if}
		</span>
	</a>
{/if}
