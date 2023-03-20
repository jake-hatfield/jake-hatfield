<script lang="ts">
	// svelte
	import { fly } from 'svelte/transition';

	// components
	import Button from '$components/utilities/Button.svelte';

	// icons
	import Close from 'carbon-icons-svelte/lib/Close.svelte';
	import Document from 'carbon-icons-svelte/lib/Document.svelte';
	import Home from 'carbon-icons-svelte/lib/Home.svelte';
	import InformationSquare from 'carbon-icons-svelte/lib/InformationSquare.svelte';
	import Menu from 'carbon-icons-svelte/lib/Menu.svelte';

	// lib
	import { kebabCase } from '$lib/utilities/string';

	// data
	const primaryLinks = ['Articles', 'Changelogs', 'Projects'];
	const secondaryLinks = [
		{ href: '/about', icon: InformationSquare, title: 'About' },
		{ href: '/resume', icon: Document, title: 'Resume' },
	];

	// state
	let isMobileMenuActive = false;

	// functions
	const closeMobileMenu = () => {
		isMobileMenuActive = false;
	};
</script>

<header class="relative mt-3 w-full pb-1.5 md:mt-0 md:border-b-2 md:border-neutral-900">
	<nav class="mt-3 flex w-full items-center justify-between">
		<div class="flex items-center">
			<Button href="/" icon={Home} kind="ghost" title="Home" type="icon" tooltipAlignment="start" />
			<ul class="hidden items-center lg:flex">
				{#each primaryLinks as link}
					<li class="ml-0.5">
						<Button
							href={link === 'Home' ? '/' : `/${kebabCase(link)}`}
							kind="ghost"
							onClick={closeMobileMenu}
							title={link}
						/>
					</li>
				{/each}
			</ul>
		</div>
		<ul class="hidden items-center lg:flex">
			{#each secondaryLinks as { href, icon, title }}
				<li class="ml-0.5 first:ml-0">
					<Button {href} {icon} kind="ghost" onClick={closeMobileMenu} {title} />
				</li>
			{/each}
		</ul>
		<div class="lg:hidden">
			<Button
				aria-expanded={isMobileMenuActive}
				icon={isMobileMenuActive ? Close : Menu}
				kind="ghost"
				onClick={() => (isMobileMenuActive = !isMobileMenuActive)}
				title="Menu"
				type="icon"
			/>
		</div>
	</nav>
	{#if isMobileMenuActive}
		<nav class="absolute inset-x-0 top-16 z-40 md:top-16" in:fly|local>
			<div class="border-2 border-neutral-900 bg-black">
				<ul class="p-3">
					{#each primaryLinks as link}
						<li class="mt-1.5 first:mt-0">
							<Button
								class="text-left"
								href={link === 'Home' ? '/' : `/${kebabCase(link)}`}
								isFullWidth
								kind="ghost"
								onClick={() => closeMobileMenu()}
								title={link}
							/>
						</li>
					{/each}
					{#each secondaryLinks as { href, icon, title }}
						<li class="mt-1.5 first:mt-0">
							<Button
								class="text-left"
								{href}
								{icon}
								isFullWidth
								kind="ghost"
								onClick={closeMobileMenu}
								{title}
							/>
						</li>
					{/each}
				</ul>
			</div>
		</nav>
	{/if}
</header>
