<script lang="ts">
	// components
	import Image from '$components/utilities/Image.svelte';
	import LaunchButton from '$components/layout/LaunchButton.svelte';

	// images
	import AvatarSrcsetWebp from '$assets/images/rasters/avatar.png?width=500;250&format=webp&srcset';
	import AvatarSrcset from '$assets/images/rasters/avatar.png?width=500;250&srcset';
	import Avatar from '$assets/images/rasters/avatar.png?width=500';

	// icons
	import {
		Documentation,
		Envelope,
		Folder,
		Growth,
		Steel,
		Tools,
		UserAnalytics,
	} from 'carbon-pictograms-svelte';

	// lib
	import technologies from '$lib/metadata/technologies';

	// types
	import type { PageData } from './$types';

	// props
	export let data: PageData;
	$: ({ imagePlaceholders } = data);
</script>

<div class="content-section">
	<header>
		<h1 class="py-3 text-3xl font-black">Welcome to HowdyOS</h1>
		<p>The official operating system for Jake Hatfield</p>
	</header>
	<!-- <Image
		alt="Jake Hatfield"
		class="md:ml-8 md:w-1/2"
		height={500}
		loading="eager"
		placeholder={imagePlaceholders[0]}
		sources={[
			{ srcset: AvatarSrcsetWebp, type: 'image/webp' },
			{ srcset: AvatarSrcset, type: 'image/png' },
		]}
		src={Avatar}
		width={250} /> -->

	<div class="flex justify-between">
		<ul class="flex flex-col justify-between">
			<li>
				<LaunchButton icon={UserAnalytics} title="About" />
			</li>
			<li>
				<LaunchButton icon={Folder} title="Articles" />
			</li>
			<li>
				<LaunchButton icon={Growth} title="Journal" />
			</li>
		</ul>
		<ul>
			<li>
				<LaunchButton icon={Steel} title="Projects" />
			</li>
			<li>
				<LaunchButton icon={Documentation} title="Resume" />
			</li>
			<li>
				<LaunchButton icon={Envelope} title="Contact" />
			</li>
			<li>
				<LaunchButton icon={Tools} title="Tools" />
			</li>
		</ul>
	</div>
	<ul class="mt-8 grid grid-cols-6 gap-3 border-2 border-zinc-900 bg-zinc-300 p-5">
		{#each technologies as technology}
			<li class="relative">
				<img src={`../logos/${technology.toLowerCase()}.svg`} alt={technology} class="h-16 w-16" />
			</li>
		{/each}
	</ul>
</div>
