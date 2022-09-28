<script lang="ts">
	// icons
	import { LogoGithub } from 'carbon-icons-svelte';

	// lib
	import { capitalize } from '$lib/utilities/string';

	// data
	const socialLinks = [{ icon: LogoGithub, title: 'github' }];
</script>

<nav aria-label="footer" class="mb-3 mt-auto w-full md:flex md:items-center md:justify-between">
	<p class="text-center text-zinc-400">
		&copy; {new Date().getFullYear()} jake hatfield
	</p>
	<ul>
		{#each socialLinks as link}
			<li>
				<a
					aria-label={`View Jake Hatfield's ${capitalize(link.title)} profile`}
					class="text-lime-400 transition-colors duration-150 hover:text-lime-500"
					href={`https://${link.title}.com/jake-hatfield`}
					target="_blank"
					rel="noopener noreferrer">
					<svelte:component this={link.icon} size={24} />
				</a>
			</li>
		{/each}
	</ul>
</nav>
