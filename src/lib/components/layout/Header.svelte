<script lang="ts">
	// svelte
	import { fly } from 'svelte/transition';

	// app
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

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
	const primaryLinks = ['Projects', 'Changelogs', 'Articles'];
	const secondaryLinks = [
		{ href: '/about', icon: InformationSquare, title: 'About' },
		{ href: '/resume.pdf', icon: Document, title: 'Resume' },
	];

	// state
	let isMobileMenuActive = false;

	// functions
	const closeMobileMenu = () => {
		isMobileMenuActive = false;
	};
</script>

<div class="sticky top-0 z-40 w-full backdrop-blur-md">
	<div class="absolute h-full w-full border-b-2 border-neutral-900 bg-black opacity-90" />
	<header class="relative mx-auto mt-3 max-w-7xl pb-1.5 md:mt-0">
		<nav class="mt-3 flex w-full items-center justify-between px-3">
			<div class="flex items-center">
				<Button
					href="/"
					icon={Home}
					kind="ghost"
					title="Home"
					type="icon"
					tooltipAlignment="start"
				/>
				<ul class="hidden items-center lg:flex">
					{#each primaryLinks as link}
						<li class="ml-5">
							<Button
								href={link === 'Home' ? '/' : `/${kebabCase(link)}`}
								isSelected={browser && $page.url.pathname === `/${link.toLowerCase()}`}
								kind="ghost"
								onClick={closeMobileMenu}
								selectedClasses="text-violet-400 hover:text-lime-400"
								title={link}
							/>
						</li>
					{/each}
				</ul>
			</div>
			<ul class="hidden items-center lg:flex">
				{#each secondaryLinks as { href, icon, title }}
					<li class="ml-5 first:ml-0">
						<Button
							{href}
							{icon}
							isSelected={browser && $page.url.pathname === href.toLowerCase()}
							kind="ghost"
							onClick={closeMobileMenu}
							selectedClasses="text-violet-400 hover:text-lime-400"
							{title}
						/>
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
			<nav class="absolute inset-x-0 top-[45px] z-40" in:fly|local>
				<div class="relative">
					<div class="absolute h-full w-full border-b-2 border-neutral-900 bg-black" />

					<ul class="p-3 ">
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
</div>
