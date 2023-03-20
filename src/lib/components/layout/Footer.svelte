<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import { LogoGithub, LogoYoutube, Rss, SendAlt } from 'carbon-icons-svelte';

	// lib
	import metadata from '$lib/metadata';

	// data
	const socialLinks = [
		{ href: `mailto:${metadata.email}`, icon: SendAlt, title: 'Contact' },
		{ href: metadata.social.github, icon: LogoGithub, title: 'Github' },
		{
			href: metadata.social.youtube,
			icon: LogoYoutube,
			title: 'YouTube',
		},
	];
</script>

<div class="mt-auto w-full">
	<footer
		class="mt-5 mb-3 flex flex-col-reverse border-t-2 border-neutral-900 pt-3 md:flex-row md:items-center md:justify-between"
	>
		<p class="mt-3 text-neutral-400 md:mt-0">
			&copy; {new Date().getFullYear()} Jake Hatfield
		</p>
		<nav>
			<ul class="flex items-center">
				{#each socialLinks as { href, icon, title }}
					<li class="ml-0.5 first:ml-0">
						<Button
							{href}
							{icon}
							isNoFollow
							kind="ghost"
							{title}
							tooltipPosition="top"
							type="icon"
						/>
					</li>
				{/each}
				<li class="ml-0.5">
					<Button
						href="/rss.xml"
						icon={Rss}
						kind="ghost"
						title="RSS"
						tooltipPosition="top"
						type="icon"
					/>
				</li>
			</ul>
		</nav>
	</footer>
</div>
