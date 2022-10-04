<script lang="ts">
	// components
	import CTA from '$components/layout/CTA.svelte';

	// icons
	import { LogoGithub, LogoYoutube, Rss } from 'carbon-icons-svelte';

	// lib
	import metadata from '$lib/metadata';

	// data
	const socialLinks = [
		{ href: metadata.social.github, icon: LogoGithub, title: 'github' },
		{
			href: metadata.social.youtube,
			icon: LogoYoutube,
			title: 'youtube',
		},
	];
</script>

<div class="mt-auto w-full">
	<CTA />
	<footer class="mt-5 mb-3 md:flex md:items-center md:justify-between">
		<p class="text-center text-zinc-500">
			&copy; {new Date().getFullYear()} jake hatfield
		</p>
		<nav>
			<ul class="flex items-center">
				{#each socialLinks as { href, icon, title }}
					<li class="ml-3 first:ml-0">
						<a
							aria-label={`${metadata.author}'s ${title} profile`}
							class="text-lime-400 transition-colors duration-150 hover:text-lime-500"
							{href}
							target="_blank"
							rel="noopener noreferrer">
							<svelte:component this={icon} size={24} />
						</a>
					</li>
				{/each}
				<li class="ml-3">
					<a
						aria-label={`rss feed`}
						class="text-lime-400 transition-colors duration-150 hover:text-lime-500"
						href={'/rss.xml'}>
						<Rss size={20} />
					</a>
				</li>
			</ul>
		</nav>
	</footer>
</div>
