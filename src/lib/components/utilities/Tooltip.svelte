<script lang="ts">
	// svelte
	import { fly } from 'svelte/transition';

	// props
	export let alignment: 'start' | 'center' | 'end' = 'center';
	export let position: 'top' | 'bottom' = 'bottom';
	export let size: 'sm' | 'md' | 'lg' | 'field' = 'md';
	export let title: string;
</script>

<span
	aria-hidden="true"
	aria-expanded="true"
	class={`absolute min-w-fit w-full ${
		alignment === 'start'
			? 'left-0'
			: alignment === 'center'
			? 'left-1/2 transform -translate-x-1/2 text-center'
			: 'right-0'
	} ${
		position === 'top'
			? size === 'sm'
				? ''
				: size === 'md'
				? 'bottom-[52px]'
				: size === 'lg'
				? ''
				: ''
			: size === 'sm'
			? 'top-12'
			: size === 'md'
			? 'top-14'
			: size === 'lg'
			? 'top-16'
			: 'top-12'
	} z-10 py-1.5 px-3 bg-neutral-800 text-sm`}
	transition:fly|local
>
	<div class="relative text-neutral-800">
		<svg
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class={`absolute transform ${
				alignment === 'start'
					? size === 'sm' || size === 'field'
						? 'right-3/4'
						: 'right-2/3'
					: alignment === 'center'
					? 'left-1/2 -translate-x-1/2'
					: size === 'sm' || size === 'field'
					? 'left-3/4'
					: 'left-2/3'
			} ${position === 'top' ? 'top-[20px] rotate-180' : '-top-[17px]'}`}
			viewBox="0 0 16 16"
		>
			<path
				d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
			/>
		</svg>
	</div>

	<span class="whitespace-nowrap text-white">
		{title}
	</span>
</span>
