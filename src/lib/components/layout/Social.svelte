<script lang="ts">
	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import LogoBehance from '$assets/images/vectors/LogoBehance.svelte';
	import LogoDiscord from 'carbon-icons-svelte/lib/LogoDiscord.svelte';
	import LogoLinkedin from 'carbon-icons-svelte/lib/LogoLinkedin.svelte';
	import LogoGithub from 'carbon-icons-svelte/lib/LogoGithub.svelte';
	import LogoSpotify from '$assets/images/vectors/LogoSpotify.svelte';
	import LogoYoutube from 'carbon-icons-svelte/lib/LogoYoutube.svelte';
	import Rss from '$assets/images/vectors/Rss.svelte';
	import SendAltFilled from 'carbon-icons-svelte/lib/SendAltFilled.svelte';

	// lib
	import metadata from '$lib/metadata';

	// data
	const socialLinks = [
		{ href: `mailto:${metadata.email}`, icon: SendAltFilled, title: 'Contact' },
		{ href: metadata.social.github, icon: LogoGithub, title: 'Github' },
		{ href: metadata.social.linkedin, icon: LogoLinkedin, title: 'LinkedIn' },
		{ href: metadata.social.behance, icon: LogoBehance, title: 'Behance' },
		{ href: metadata.social.discord, icon: LogoDiscord, title: 'Discord' },
		{ href: metadata.social.spotify, icon: LogoSpotify, title: 'Spotify' },
		{
			href: metadata.social.youtube,
			icon: LogoYoutube,
			title: 'YouTube',
		},
	];
</script>

<nav class={$$props.class ? $$props.class : ''}>
	<ul class="flex flex-wrap items-center">
		{#each socialLinks as { href, icon, title }}
			<li class="ml-0.5 first:ml-0">
				<Button
					{href}
					{icon}
					isExternal
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
