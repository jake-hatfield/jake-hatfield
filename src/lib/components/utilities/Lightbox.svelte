<script lang="ts">
	// svelte
	import { fade } from 'svelte/transition';

	// lib
	import { handleKeyboardShortcut } from '$lib/utilities/click';

	// * required props *
	export let description: string;

	// state
	let isActive = false;
</script>

<button
	class="mt-5 w-full cursor-zoom-in focus:outline-none focus:ring-1 focus:ring-lime-400"
	on:click={() => (isActive = true)}
>
	<slot />
</button>
<em class="mono mt-3 mb-5 block text-center text-sm">{description}</em>

{#if isActive}
	<div aria-expanded={isActive} transition:fade={{ duration: 150 }}>
		<div
			aria-hidden="true"
			class="fixed inset-0 -top-20 z-40 h-[10000px] cursor-zoom-out bg-neutral-700 opacity-75 lg:-top-12"
			on:click={() => (isActive = false)}
			use:handleKeyboardShortcut={{ code: 'Escape' }}
		/>
		<aside
			class="minimal-scrollbar fixed left-2 right-2 top-0 z-40 max-h-screen max-w-6xl transform overflow-y-auto bg-neutral-900 p-8 md:top-1/2 md:left-1/2 md:max-h-screen md:w-full md:-translate-x-1/2 md:-translate-y-1/2"
		>
			<div class="mx-auto flex min-w-full max-w-none justify-center">
				<slot />
			</div>
		</aside>
	</div>
{/if}
