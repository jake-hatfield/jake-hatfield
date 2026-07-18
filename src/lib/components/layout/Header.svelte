<script lang="ts">
	// svelte
	import { fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';

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

	const primaryLinks = [
		{ href: '/projects', title: 'Work' },
		{ href: '/articles', title: 'Writing' },
	];

	const secondaryLinks = [
		{ href: '/about', icon: InformationSquare, title: 'About' },
		{ href: '/resume.pdf', icon: Document, title: 'Resume' },
	];

	let isMobileMenuActive = false;
	let prefersReducedMotion = false;

	if (browser) {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	const setBodyScrollLock = (locked: boolean) => {
		if (!browser) return;
		document.body.style.overflow = locked ? 'hidden' : '';
	};

	const closeMobileMenu = () => {
		isMobileMenuActive = false;
		setBodyScrollLock(false);
	};

	const toggleMobileMenu = () => {
		isMobileMenuActive = !isMobileMenuActive;
		setBodyScrollLock(isMobileMenuActive);
	};

	onDestroy(() => setBodyScrollLock(false));

	const isActivePath = (href: string) => {
		if (!browser) return false;

		const pathname = $page.url.pathname;

		if (href === '/projects') {
			return pathname.startsWith('/projects');
		}

		if (href === '/articles') {
			return pathname.startsWith('/articles') || pathname.startsWith('/changelogs');
		}

		return pathname === href || pathname.startsWith(`${href}/`);
	};
</script>

<div class="sticky top-0 z-40 w-full backdrop-blur-md">
	<div class="absolute h-full w-full border-b-2 border-neutral-900 bg-black opacity-90" />
	<header class="relative mx-auto max-w-4xl pb-1.5 md:mt-0">
		<nav class="mt-3 flex w-full items-center justify-between px-3 sm:px-6 lg:px-8">
			<div class="flex items-center gap-3 lg:gap-5">
				<Button
					href="/"
					icon={Home}
					kind="ghost"
					title="Home"
					type="icon"
					tooltipAlignment="start"
				/>
				<ul class="hidden items-center lg:flex">
					{#each primaryLinks as { href, title }}
						<li>
							<Button
								{href}
								isSelected={isActivePath(href)}
								kind="ghost"
								onClick={closeMobileMenu}
								selectedClasses="text-violet-400 hover:text-lime-400"
								{title}
							/>
						</li>
					{/each}
				</ul>
			</div>
			<ul class="hidden items-center gap-3 lg:flex">
				{#each secondaryLinks as { href, icon, title }}
					<li>
						<Button
							{href}
							{icon}
							isSelected={isActivePath(href)}
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
					aria-controls="mobile-menu"
					aria-expanded={isMobileMenuActive}
					icon={isMobileMenuActive ? Close : Menu}
					kind="ghost"
					onClick={toggleMobileMenu}
					title="Menu"
					type="icon"
				/>
			</div>
		</nav>
		{#if isMobileMenuActive}
			<button
				aria-label="Close menu"
				class="fixed inset-0 z-30 bg-black/70 lg:hidden"
				on:click={closeMobileMenu}
				tabindex="-1"
				type="button"
			></button>
			<nav
				class="absolute inset-x-0 top-[45px] z-40"
				aria-label="Mobile"
				in:fly={prefersReducedMotion ? { duration: 0 } : { duration: 200, y: -8 }}
			>
				<div class="relative border-b-2 border-neutral-900 bg-black">
					<ul class="p-3" id="mobile-menu">
						{#each primaryLinks as { href, title }}
							<li class="mt-1.5 first:mt-0">
								<Button
									class="text-left"
									{href}
									isFullWidth
									isSelected={isActivePath(href)}
									kind="ghost"
									onClick={closeMobileMenu}
									{title}
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
									isSelected={isActivePath(href)}
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
