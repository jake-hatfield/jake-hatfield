<script lang="ts">
	// icons
	import Quotes from 'carbon-icons-svelte/lib/Quotes.svelte';

	// * required props *
	export let author: string;
</script>

<li
	class={`list-none relative border-2 border-neutral-800 bg-black p-5 text-white ${
		$$props.class ? $$props.class : ''
	}`}
>
	<Quotes
		class="absolute top-0 left-0 -translate-x-2 -translate-y-4 transform text-violet-700 md:-translate-y-3 md:-translate-x-2"
		size={32}
	/>
	<Quotes
		class="absolute top-0 left-0 -translate-y-3 -translate-x-1 transform text-lime-400 md:-translate-x-3 md:-translate-y-4"
		size={32}
	/>
	<blockquote class="text-base text-neutral-200">
		<slot name="content" />
	</blockquote>
	<p class="mt-3 text-neutral-200">
		<span role="img" aria-label="Megaphone emoji">📢</span> <cite>{author}</cite>
	</p>
	<Quotes
		class="absolute -bottom-3 -right-3 -translate-y-5 -translate-x-2 rotate-180 transform text-violet-700"
		size={32}
	/>
	<Quotes
		class="absolute -bottom-3 -right-3 -translate-x-3 -translate-y-6 rotate-180 transform text-lime-400"
		size={32}
	/>
</li>
