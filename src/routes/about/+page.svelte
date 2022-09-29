<script lang="ts">
	// lib
	import futureTechnologies from '$lib/metadata/futureTechnologies';
	import nonTechnicalSkills from '$lib/metadata/nonTechnicalSkills';
	import technologies from '$lib/metadata/technologies';
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">about</h1>
	</header>
	<p class="mt-5">
		i'm jake hatfield. i'm a self-taught full-stack engineer and I wrote my first line of code in
		nov '19. i would describe myself as a circumstantial generalist who learns something new every
		day. i started this site to share what's currently taking my time and attention.
	</p>
	<p class="mt-3">
		most of my experience has been trial-by-fire as i bootstrapped a solo business in '20 that has
		evolved from a spreadsheet with custom macros into an entire suite of tools. i'm still here 2+
		years later, thanks mostly to trusty old google and the deep desire not to make the same idiotic
		mistake twice <span role="img" aria-label="Sweat smile emoji">😅</span>.
	</p>
	<p class="mt-3">
		i graduated from texas a&m in '16 with a b.s. in biology that i would love to use in conjunction
		with programming one day. i now live in houston, texas with my wife <span
			role="img"
			aria-label="Woman emoji">👩</span
		>, our daughter <span role="img" aria-label="Baby emoji">👶</span>, and our dog
		<span role="img" aria-label="Dog emoji">🐕</span>.
	</p>
	<p class="mt-3">
		i picked up programming as a necessity for product development and was surprised to find that i
		fell in love with it. now i'm trying to refine this skill by creating an application for every
		letter of the alphabet. right now I'm on "d."
	</p>
	<p class="mt-3">
		through trial-and-error, i've become well-versed in the development requirements of modern
		applications. i can handle authentication, process payments, send emails, preserve data in
		storage, maintain uptime on the back end, and plug that all into a responsive, accessible, and
		intuitive interface on the front end.
	</p>
	<article class="mt-8">
		<header>
			<h2 class="text-2xl font-black">my technologies</h2>
		</header>
		<ul class="pl-5 md:pl-8">
			{#each technologies as technology}
				<li class="mt-1.5 list-disc">{technology}</li>
			{/each}
		</ul>
	</article>
	<article class="mt-8">
		<header>
			<h2 class="text-2xl font-black">my non-technical skills</h2>
		</header>
		<ul class="pl-5 md:pl-8">
			{#each nonTechnicalSkills as skill}
				<li class="mt-1.5 list-disc">{skill}</li>
			{/each}
		</ul>
	</article>
	<article class="mt-8">
		<header>
			<h2 class="text-2xl font-black">my future learning interests</h2>
		</header>
		<ul class="pl-5 md:pl-8">
			{#each futureTechnologies as technology}
				<li class="mt-1.5 list-disc">{technology}</li>
			{/each}
		</ul>
	</article>
</section>
