<script lang="ts">
	// svelte
	import { fly } from 'svelte/transition';

	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import { Close, InformationSquare, Menu, SendAlt } from 'carbon-icons-svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';
	import metadata from '$lib/metadata';

	// data
	const primaryLinks = ['home', 'changelogs', 'articles', 'projects', 'uses'];
	const secondaryLinks = [
		{ href: '/about', icon: InformationSquare, title: 'about' },
		{ href: `mailto:${metadata.email}`, icon: SendAlt, title: 'contact' },
	];

	// state
	let isMobileMenuActive = false;

	// functions
	const closeMobileMenu = () => {
		isMobileMenuActive = false;
	};
</script>

<header class="relative mt-3 w-full pb-1.5 md:mt-0 md:border-b-2 md:border-zinc-800">
	<nav class="mt-3 hidden w-full items-center justify-between lg:flex">
		<ul class="flex items-center">
			{#each primaryLinks as link}
				<li class="ml-3 first:ml-0">
					<Button
						href={link === 'home' ? '/' : `/${kebabCase(link)}`}
						kind="ghost"
						onClick={closeMobileMenu}
						title={link} />
				</li>
			{/each}
		</ul>
		<ul class="flex items-center">
			{#each secondaryLinks as { href, icon, title }}
				<li class="ml-3 first:ml-0">
					<Button {href} {icon} kind="ghost" onClick={closeMobileMenu} {title} />
				</li>
			{/each}
		</ul>
	</nav>
	<div class="flex justify-end md:hidden">
		<Button
			aria-expanded={isMobileMenuActive}
			kind="icon"
			icon={isMobileMenuActive ? Close : Menu}
			iconSize={32}
			onClick={() => (isMobileMenuActive = !isMobileMenuActive)}
			title="Menu" />
	</div>
	{#if isMobileMenuActive}
		<nav class="absolute inset-x-0 top-16 z-40 md:top-16" in:fly|local>
			<div class="border-2 border-zinc-800 bg-black">
				<ul class="p-3">
					{#each primaryLinks as link}
						<li class="mt-1.5 first:mt-0">
							<Button
								href={link === 'home' ? '/' : `/${kebabCase(link)}`}
								isFullWidth
								kind="ghost"
								onClick={() => closeMobileMenu()}
								title={link} />
						</li>
					{/each}
					{#each secondaryLinks as { href, icon, title }}
						<li class="mt-1.5 first:mt-0">
							<Button
								<Button
								{href}
								{icon}
								isFullWidth
								kind="ghost"
								onClick={closeMobileMenu}
								{title} />
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	{/if}
</header>
