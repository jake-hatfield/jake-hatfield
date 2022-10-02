<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';
	import Use from '$routes/uses/Use.svelte';
</script>

<section>
	<header>
		<h1 class="text-3xl font-black">uses</h1>
	</header>
	<p class="mt-5">
		i'm inspired quite a bit by <Link
			href="https://www.ted.com/talks/steve_lacy_the_bare_maximum"
			isExternal
			isUnderlined
			title="steve lacy's talk" /> on how the tools we use to build things are much less important than
		the things we build with them. i mean, the dude wrote a song entirely with garageband on his iphone
		and was nominated for a grammy, so there's probably some merit there.
	</p>
	<p class="mt-3">
		therefore, this page exists for me to document and later reference why i enjoyed the tools i
		created with at a certain point in time. these things aren't important, it's just for fun <span
			role="img"
			aria-label="Party emoji">🥳</span
		>.
	</p>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">workstation</h2>
	</header>
	<ul class="mt-5">
		<Use
			href="https://pcpartpicker.com/list/RJDHrD"
			title="i9-9900k, geforce rtx 3060ti, 32 gb of ram, 2 tb m.2 ssd"
			type="pc">
			<div class="mt-3" slot="description">
				<p>
					this is the first computer i ever built, and it's so much fun to use. being present for
					and having to deal with <Link
						href="https://youtu.be/UNcx9JdC9VM?t=238"
						isExternal
						isUnderlined
						title="this nonsense" /> to get my gpu was worth. prior to this i was using a laptop that
					got hotter than the surface of the sun while browsing the internet, so it's a big upgrade for
					me.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.amazon.com/gp/product/B08BCRYS6B/"
			title="lg 27gn950-b"
			type="monitor x2">
			<div class="mt-3" slot="description">
				<p>
					my first 4k monitor. works great for graphic design, video editing, gaming, etc. i spend a
					lot of time in front of a screen as a byproduct of work, so it's nice for my eyes not to
					be dying at the end of the day.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07NY9ZT92/" title="logitech g915" type="keyboard">
			<div class="mt-3" slot="description">
				<p>
					snappy mechanical keyboard. what drew me in was the construction quality and the macro
					assignability. it's as helpful as i expected to be able to shortcut a few commands while
					working.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07GBZ4Q68/" title="logitech g502 hero" type="mouse">
			<div class="mt-3" slot="description">
				<p>
					really nice-feeling mouse. i think i might have enjoyed the wireless version better, but
					no complaints after several years of use.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B081PP4CB6/" title="logitech g pro x" type="headset">
			<div class="mt-3" slot="description">
				<p>audio quality is clean and the mic is solid. i'll never go back to a wired headset.</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07TZT4Q89/" title="logitech streamcam" type="webcam">
			<div class="mt-3" slot="description">
				<p>
					with all of my work being remote, it's nice to have a reliable webcam to join virtual
					meetings with clients and such. i can see this webcam lasting me for quite a long time.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.autonomous.ai/standing-desks/smartdesk-2-home/"
			title="autonomous smartdesk"
			type="desk">
			<div class="mt-3" slot="description">
				<p>
					i got my desk pre-covid when wfh prices were much more reasonable. i wanted a standing
					desk since sitting all day kills my back, but i didn't like any of the tops (and they were
					significantly more expensive that way). i opted for just the base and built the top out of
					poplar.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.autonomous.ai/office-chairs/ergonomic-chair/"
			title="autonomous ergochair pro"
			type="chair">
			<div class="mt-3" slot="description">
				<p>
					very good quality chair. it's certainly improved my posture and alleviated back pain from
					sitting too long.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">development</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://code.visualstudio.com/" title="vscode" type="ide">
			<div class="mt-3" slot="description">
				<p>
					this is the only text editor i've ever used, so i don't necessarily know what i'm missing,
					but i also haven't dove into the apparent chaos that is vim. the community is mature and
					there's been an extension for anything i've wanted so far.
				</p>
			</div>
		</Use>
		<Use href="https://github.com/PandaTheme/" title="panda syntax" type="theme">
			<div class="mt-3" slot="description">
				<p>
					the theme i use fluctuates a lot, but panda is the one i've stuck with the longest. i like
					the amount of contrast for important pieces of code and soft colors for things that don't
					immediately need my attention.
				</p>
			</div>
		</Use>
		<Use href="https://www.monolisa.dev/" title="monolisa" type="font">
			<div class="mt-3" slot="description">
				<p>
					very easy on the eyes, and i like the use of ligatures on things like fat arrows and
					triple equals.
				</p>
			</div>
		</Use>
		<Use href="https://brave.com/" title="brave" type="browser">
			<div class="mt-3" slot="description">
				<p>
					using a chromium-based browser makes a lot of sense and seems to be standard practice, but
					i value my privacy a lot. brave seems to be the best of both worlds. let's see if they can
					manage to stay that way <span role="img" aria-label="Man shrugging emoji">🤷‍♂️</span>.
				</p>
			</div>
		</Use>
		<Use href="https://github.com/jake-hatfield/" title="github" type="code repository">
			<div class="mt-3" slot="description">
				<p>ofc.</p>
			</div>
		</Use>
		<Use href="https://ngrok.com/" title="ngrok" type="tunneling">
			<div class="mt-3" slot="description">
				<p>
					helpful in a development environment for verifying webhooks, setting up oauth, handling
					payment wallets like apple pay, etc.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">design</h2>
	</header>
	<ul class="mt-5">
		<Use
			href="https://www.adobe.com/products/illustrator.html"
			title="illustrator"
			type="vector editing">
			<div class="mt-3" slot="description">
				<p>
					i hate adobe, but this is their best product in my opinion. i use it for creating logos
					and graphics, modifying .svgs, etc.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.adobe.com/products/photoshop.html"
			title="photoshop"
			type="raster editing">
			<div class="mt-3" slot="description">
				<p>
					i jump into this one less often since i prefer working with vectors whenever possible, but
					i know my way around it.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.adobe.com/products/premiere.html"
			title="premiere pro / after effects"
			type="video editing">
			<div class="mt-3" slot="description">
				<p>i can crank out a product demo video or advert with minimal googling.</p>
			</div>
		</Use>
		<Use href="https://www.figma.com/" title="figma" type="ui / ux">
			<div class="mt-3" slot="description">
				<p>
					bet you thought i was gonna say xd, huh? figma is one of the most performant, intuitive
					pieces of software i've used.
				</p>
			</div>
		</Use>
		<Use href="https://jakearchibald.github.io/svgomg/" title="svgomg" type="vector optimization">
			<div class="mt-3" slot="description">
				<p>
					great, simple tool. i use it on pretty much every .svg i deal with (if i remember <span
						role="img"
						aria-label="Brain emoji">🧠</span> to).
				</p>
			</div>
		</Use>
		<Use href="https://squoosh.app/" title="squoosh" type="raster optimization">
			<div class="mt-3" slot="description">
				<p>the best raster optimizer i've found, and free.</p>
			</div>
		</Use>
		<Use
			href="https://carbondesignsystem.com/guidelines/icons/library/"
			title="carbon"
			type="icons">
			<div class="mt-3" slot="description">
				<p>
					i'm a huge fan of this design system in general, but the pack is very polished and easy to
					use. the style works well with the types of sites i tend to create.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">deployment</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://www.netlify.com/" title="netlify" type="hosting">
			<div class="mt-3" slot="description">
				<p>
					i've hosted most of my gatsbyjs projects here, but i'm slowly making the switch to vercel
					for static sites since they have a better free plan and d a r k m o d e.
				</p>
			</div>
		</Use>
		<Use href="https://www.vercel.com/" title="vercel" type="hosting">
			<div class="mt-3" slot="description">
				<p>
					generous free plan, plays nicely with sveltekit projects. seems to be one of the go-tos
					with developers for hosting nowadays.
				</p>
			</div>
		</Use>
		<Use href="https://www.heroku.com/" title="heroku" type="hosting">
			<div class="mt-3" slot="description">
				<p>
					when i started using this, it was awesome. years later, it's virtually unchanged, yet
					somehow not awesome. i see reports of issues quite a bit, like outages or env variable
					leaks. since i've gone serverless on most of my projects, i don't have a huge need for
					their services, but i forsee myself trying to find a better product in the future.
				</p>
			</div>
		</Use>
		<Use href="https://www.namecheap.com/" title="namecheap" type="domains">
			<div class="mt-3" slot="description">
				<p>
					if i don't buy the domain directly through the host, i'll usually get it here. i've never
					had any issues and everything works like it should.
				</p>
			</div>
		</Use>
		<Use href="https://docs.github.com/en/actions" title="github actions" type="ci">
			<div class="mt-3" slot="description">
				<p>
					my ci experience is mostly limited to running unit tests this way. i'm always learning
					more, though, and am open to a better ci/cd pipeline if you wanna <Link
						href="/contact"
						isUnderlined
						title="drop a rec" />.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header>
		<h2 class="text-2xl font-black">productivity</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://slack.com/" title="slack" type="team communication">
			<div class="mt-3" slot="description">
				<p>
					clean interface. helpful for keeping track of communication and consolidating user
					interactions with my apps via webhooks.
				</p>
			</div>
		</Use>
		<Use href="https://bitwarden.com/" title="bitwarden" type="password management">
			<div class="mt-3" slot="description">
				<p>
					i reused the same password on all services like an idiot until my chipotle account got
					compromised and someone ordered a metric ton of burritos with my card. switched to
					bitwarden, re-created insane 40-character alphanumeric passwords, never looked back.
				</p>
			</div>
		</Use>
	</ul>
</section>
