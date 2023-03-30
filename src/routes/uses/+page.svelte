<script lang="ts">
	// components
	import Link from '$components/utilities/Link.svelte';
	import SEO from '$components/utilities/seo/index.svelte';
	import Use from '$routes/uses/Use.svelte';

	// lib
	import metadata from '$lib/metadata';

	// seo
	const title = 'Uses';
	const slug = 'uses';
	const seoProps = {
		breadcrumbs: [{ title, slug }],
		createdAt: '2022-10-06T00:00:00.000+0100',
		metaDescription: 'See what tools Jake Hatfield uses to create projects.',
		readingTime: '5 mins.',
		slug,
		title,
		updatedAt: '2022-10-06T00:00:00.000+0100',
	};
</script>

<SEO {...seoProps} />

<section>
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h1 class="text-3xl font-black">Uses</h1>
	</header>
	<p class="mt-5">
		I'm inspired quite a bit by <Link
			href="https://www.ted.com/talks/steve_lacy_the_bare_maximum"
			isExternal
			isUnderlined
			title="Steve Lacy's talk"
		/> on how the tools we use to build things are much less important than the things we build with
		them. I mean, the dude wrote a song entirely with GarageBand on his iPhone and was nominated for
		a Grammy, so there's probably some merit there.
	</p>
	<p class="mt-3">
		Therefore, this page exists for me to document and later reference why I enjoyed the tools I
		created with at a certain point in time. These things aren't important, it's just for fun <span
			role="img"
			aria-label="Party emoji">🥳</span
		>.
	</p>
</section>
<section class="mt-8">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">Workstation</h2>
	</header>
	<ul class="mt-5">
		<Use
			href="https://pcpartpicker.com/list/RJDHrD"
			title="i9-9900k, GeForce RTX 3060TI, 32 GB of RAM, 2 TB m.2 SSD"
			type="PC"
		>
			<div class="mt-3" slot="description">
				<p>
					This is the first computer I ever built, and it's so much fun to use. Being present for
					and having to deal with <Link
						href="https://youtu.be/UNcx9JdC9VM?t=238"
						isExternal
						isUnderlined
						title="this nonsense"
					/> to get my GPU was worth. Prior to this I was using a laptop that got hotter than the surface
					of the sun while browsing the internet, so it's a big upgrade for me.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.amazon.com/gp/product/B08BCRYS6B/"
			title="LG 27GN950-B"
			type="Monitor x2"
		>
			<div class="mt-3" slot="description">
				<p>
					My first 4k monitor. works great for graphic design, video editing, gaming, etc. I spend a
					lot of time in front of a screen as a byproduct of work, so it's nice for my eyes not to
					be dying at the end of the day.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07NY9ZT92/" title="Logitech G915" type="Keyboard">
			<div class="mt-3" slot="description">
				<p>
					Snappy mechanical keyboard. What drew me in was the construction quality and the macro
					assignability. It's as helpful as I expected to be able to shortcut a few commands while
					working.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07GBZ4Q68/" title="Logitech G502 Hero" type="Mouse">
			<div class="mt-3" slot="description">
				<p>
					Really nice-feeling mouse. I think I might have enjoyed the wireless version better, but
					no complaints after several years of use. Wheel goes brrrr.
				</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B081PP4CB6/" title="Logitech G Pro X" type="Headset">
			<div class="mt-3" slot="description">
				<p>Audio quality is clean and the mic is solid. I'll never go back to a wired headset.</p>
			</div>
		</Use>
		<Use href="https://www.amazon.com/dp/B07TZT4Q89/" title="Logitech Streamcam" type="Webcam">
			<div class="mt-3" slot="description">
				<p>
					With all of my work being remote, it's nice to have a reliable webcam to join virtual
					meetings with clients and such. I can see this webcam lasting me for quite a long time.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.autonomous.ai/standing-desks/smartdesk-2-home/"
			title="Autonomous Smartdesk"
			type="Desk"
		>
			<div class="mt-3" slot="description">
				<p>
					I got my desk pre-COVID when WFH prices were much more reasonable. I wanted a standing
					desk since sitting all day kills my back, but I didn't like any of the tops (and they were
					significantly more expensive that way). I opted for just the base and built the top out of
					poplar.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.autonomous.ai/office-chairs/ergonomic-chair/"
			title="Autonomous Ergochair Pro"
			type="Chair"
		>
			<div class="mt-3" slot="description">
				<p>
					Very good quality chair. It's certainly improved my posture and alleviated back pain from
					sitting too long.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">Development</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://code.visualstudio.com/" title="VSCode" type="IDE">
			<div class="mt-3" slot="description">
				<p>
					This is the only text editor I've ever used, so I don't necessarily know what I'm missing,
					but I also haven't dove into the apparent chaos that is vim. The community is mature and
					there's been an extension for anything I've wanted so far.
				</p>
			</div>
		</Use>
		<Use href="https://github.com/PandaTheme/" title="Panda Syntax" type="Theme">
			<div class="mt-3" slot="description">
				<p>
					The theme I use fluctuates a lot, but Panda is the one I've stuck with the longest. I like
					the amount of contrast for important pieces of code and soft colors for things that don't
					immediately need my attention.
				</p>
			</div>
		</Use>
		<Use href="https://www.monolisa.dev/" title="MonoLisa" type="Font">
			<div class="mt-3" slot="description">
				<p>
					Very easy on the eyes, and I like the use of ligatures on things like fat arrows and
					triple equals.
				</p>
			</div>
		</Use>
		<Use href="https://brave.com/" title="Brave" type="Browser">
			<div class="mt-3" slot="description">
				<p>
					Using a Chromium-based browser makes a lot of sense and seems to be standard practice, but
					I value my privacy a lot. Brave seems to be the best of both worlds. Let's see if they can
					manage to stay that way <span role="img" aria-label="Man shrugging emoji">🤷‍♂️</span>.
				</p>
			</div>
		</Use>
		<Use href="https://github.com/jake-hatfield/" title="Github" type="Code repository">
			<div class="mt-3" slot="description">
				<p>OFC.</p>
			</div>
		</Use>
		<Use href="https://ngrok.com/" title="ngrok" type="Tunneling">
			<div class="mt-3" slot="description">
				<p>
					Helpful in a development environment for verifying webhooks, setting up OAuth, handling
					payment wallets like Apple Pay, etc.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">Design</h2>
	</header>
	<ul class="mt-5">
		<Use
			href="https://www.adobe.com/products/illustrator.html"
			title="Illustrator"
			type="Vector editing"
		>
			<div class="mt-3" slot="description">
				<p>
					I hate Adobe, but this is their best product in my opinion. I use it for creating logos
					and graphics, modifying .svgs, etc.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.adobe.com/products/photoshop.html"
			title="Photoshop"
			type="Raster editing"
		>
			<div class="mt-3" slot="description">
				<p>
					I jump into this one less often since I prefer working with vectors whenever possible, but
					I know my way around it.
				</p>
			</div>
		</Use>
		<Use
			href="https://www.adobe.com/products/premiere.html"
			title="Premiere Pro / After Effects"
			type="Video editing"
		>
			<div class="mt-3" slot="description">
				<p>I can crank out a product demo video or advert with minimal Googling.</p>
			</div>
		</Use>
		<Use href="https://www.figma.com/" title="Figma" type="UI / UX">
			<div class="mt-3" slot="description">
				<p>
					Bet you thought I was gonna say XD, huh? Figma is one of the most performant, intuitive
					pieces of software I've used.
				</p>
			</div>
		</Use>
		<Use href="https://jakearchibald.github.io/svgomg/" title="SVGOMG" type="Vector optimization">
			<div class="mt-3" slot="description">
				<p>Great, simple tool. I use it on pretty much every .svg I deal with.</p>
			</div>
		</Use>
		<Use href="https://squoosh.app/" title="Squoosh" type="Raster optimization">
			<div class="mt-3" slot="description">
				<p>The best raster optimizer I've found, and free.</p>
			</div>
		</Use>
		<Use
			href="https://carbondesignsystem.com/guidelines/icons/library/"
			title="Carbon"
			type="Icons"
		>
			<div class="mt-3" slot="description">
				<p>
					I'm a huge fan of this design system in general, but the pack is very polished and easy to
					use. The style works well with the types of sites I tend to create.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">Deployment</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://www.netlify.com/" title="Netlify" type="Hosting">
			<div class="mt-3" slot="description">
				<p>
					I've hosted most of my Gatsby.js projects here, but I'm slowly making the switch to Vercel
					for static sites since they have a better free plan and d a r k m o d e.
				</p>
			</div>
		</Use>
		<Use href="https://www.vercel.com/" title="Vercel" type="Hosting">
			<div class="mt-3" slot="description">
				<p>
					Generous free plan, plays nicely with SvelteKit projects. seems to be one of the go-tos
					with developers for hosting nowadays.
				</p>
			</div>
		</Use>
		<Use href="https://www.heroku.com/" title="Heroku" type="Hosting">
			<div class="mt-3" slot="description">
				<p>
					When I started using this, it was awesome. Years later, it's virtually unchanged, yet
					somehow not awesome. I see reports of issues quite a bit, like outages or .env variable
					leaks. Since I've gone serverless on most of my projects, I don't have a huge need for
					their services, but I forsee myself trying to find a better product in the future.
				</p>
			</div>
		</Use>
		<Use href="https://www.namecheap.com/" title="Namecheap" type="Domains">
			<div class="mt-3" slot="description">
				<p>
					If I don't buy the domain directly through the host, I'll usually get it here. I've never
					had any issues and everything works like it should.
				</p>
			</div>
		</Use>
		<Use href="https://docs.github.com/en/actions" title="Github Actions" type="CI">
			<div class="mt-3" slot="description">
				<p>
					My CI experience is mostly limited to running unit tests this way. I'm always learning
					more, though, and am open to a better CI/CD pipeline if you wanna <Link
						href={`mailto:${metadata.email}?subject=ci/cd recommendation`}
						isExternal
						isUnderlined
						title="drop a rec"
					/>.
				</p>
			</div>
		</Use>
	</ul>
</section>
<section class="mt-8">
	<header class="border-b-2 border-neutral-900 pb-1.5">
		<h2 class="text-2xl font-black">Apps</h2>
	</header>
	<ul class="mt-5">
		<Use href="https://slack.com/" title="Slack" type="Team communication">
			<div class="mt-3" slot="description">
				<p>
					Clean interface. Helpful for keeping track of communication and consolidating user
					interactions with my apps via webhooks.
				</p>
			</div>
		</Use>
		<Use href="https://bitwarden.com/" title="Bitwarden" type="Password management">
			<div class="mt-3" slot="description">
				<p>
					I reused the same password on all services like an idiot until my Chipotle account got
					compromised and someone ordered a metric ton of burritos with my card. Switched to
					Bitwarden, re-created insane 40-character alphanumeric passwords, never looked back.
				</p>
			</div>
		</Use>
	</ul>
</section>
