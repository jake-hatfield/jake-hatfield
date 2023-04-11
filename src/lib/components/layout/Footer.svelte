<script lang="ts">
	// components
	import Social from '$components/layout/Social.svelte';
</script>

<div class="z-40 mx-auto mt-auto w-full">
	<div class="mt-content w-full border-t-2 border-neutral-900">
		<div class="mx-auto max-w-7xl px-3">
			<footer
				class="mb-3 flex flex-col-reverse pt-3 md:flex-row md:items-center md:justify-between"
			>
				<p class="mt-3 text-neutral-200 md:mt-0">
					&copy; {new Date().getFullYear()} Jake Hatfield
				</p>
				<Social />
			</footer>
		</div>
	</div>
</div>
