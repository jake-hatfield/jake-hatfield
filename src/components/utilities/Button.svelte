<script lang="ts">
	// components
	import Spinner from '$components/utilities/Spinner.svelte';
	import Tooltip from '$components/utilities/Tooltip.svelte';

	// * required props *
	export let title: string;

	// optional props
	export let disabled = false;
	export let href: string = '';
	export let icon: any | null = null;
	export let iconSize = 18;
	export let isFullWidth = false;
	export let isSelected = false;
	export let isTooltipActive = false;
	export let kind: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'icon' = 'primary';
	export let level: 0 | 1 = 0;
	export let loading = false;
	export let onClick = () => {};
	export let onMouseEnter = () => {};
	export let onMouseLeave = () => {};
	export let selectionType: 'primary' | 'secondary' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'field' = 'md';
	export let tooltipAlignment: 'start' | 'center' | 'end' = 'center';
	export let tooltipPosition: 'top' | 'bottom' = 'bottom';

	if (kind === 'icon' && !icon) throw new Error('Icon is required');

	// state
	const commonLayoutClasses = `flex items-center justify-center md:justify-between ${
		isFullWidth === true ? 'w-full' : 'w-fit'
	} ${
		size === 'sm'
			? 'py-0.5 px-1'
			: size === 'md'
			? 'p-1.5'
			: size === 'lg'
			? 'p-3'
			: 'pt-[9px] pb-[9px] px-3 border-b border-transparent'
	}`;
	const commonTypographyClasses = `${
		size === 'lg' ? 'text-base' : 'text-sm'
	} tracking-wide font-semibold`;
	const commonStyleClasses = `${
		kind === 'primary'
			? 'bg-lime-400 text-black hover:bg-lime-500'
			: kind === 'secondary'
			? 'bg-violet-700 text-lime-400 hover:bg-violet-800'
			: kind === 'tertiary'
			? 'bg-zinc-700 text-white hover:bg-zinc-800'
			: 'bg-black hover:bg-violet-700 text-lime-400'
	} ring-1 ring-transparent focus:outline-none focus:ring-lime-400 transition duration-150`;

	const commonIconSize = iconSize ? iconSize : size === 'sm' || size === 'field' ? 16 : 18;

	$: inactive = loading || disabled;
</script>

<div class="relative inline">
	{#if href}
		<a
			aria-label={kind === 'icon' ? title : ''}
			{href}
			on:mouseenter={() => {
				isTooltipActive = true;
				onMouseEnter();
			}}
			on:mouseleave={() => {
				isTooltipActive = false;
				onMouseLeave();
			}}
			class={`${commonLayoutClasses} ${commonStyleClasses} ${commonTypographyClasses} ${
				!isSelected
					? 'border-b-2 border-transparent'
					: selectionType === 'primary'
					? 'header-link-active'
					: 'subheader-link-active'
			} ${$$props.class}`}>
			{#if kind !== 'icon'}
				<span>
					{title}
				</span>
			{/if}
			{#if icon}
				<svelte:component
					this={icon}
					class={`text-orange-400 ${kind !== 'icon' ? 'ml-1.5' : ''}`}
					size={commonIconSize} />
			{/if}
		</a>
	{:else}
		<button
			aria-label={kind === 'icon' ? title : ''}
			on:click|preventDefault={() => {
				isTooltipActive = false;
				onClick();
			}}
			on:mouseenter={() => {
				isTooltipActive = true;
				onMouseEnter();
			}}
			on:mouseleave={() => {
				isTooltipActive = false;
				onMouseLeave();
			}}
			class={`${commonLayoutClasses}  ${commonTypographyClasses} ${
				inactive
					? 'bg-zinc-700 text-zinc-300 text-opacity-80 cursor-not-allowed'
					: commonStyleClasses
			} ${$$props.class}`}
			disabled={inactive}
			{...$$props.rest}>
			{#if kind !== 'icon'}
				{#if loading}
					<Spinner />
				{/if}
				<span class={`whitespace-nowrap ${loading ? 'ml-1.5 md:ml-2' : ''}`}>
					{title}
				</span>
			{/if}
			{#if icon}
				<svelte:component
					this={icon}
					class={`flex-none text-orange-400 ${kind !== 'icon' ? 'ml-1.5' : ''}`}
					size={commonIconSize} />
			{/if}
		</button>
	{/if}
	{#if isTooltipActive && kind === 'icon'}
		<Tooltip alignment={tooltipAlignment} {level} position={tooltipPosition} {size} {title} />
	{/if}
</div>
