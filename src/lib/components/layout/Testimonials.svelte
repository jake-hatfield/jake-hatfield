<script lang="ts">
	// components
	import Testimonial from '$components/layout/Testimonial.svelte';
</script>

<section class="mt-content">
	<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
		<h2 class="header text-2xl font-black">What clients say</h2>
	</header>
	<ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
		<Testimonial author="Samuel Broadbent, Founder of Transform Writing">
			<div slot="content">
				<p>
					Jake proposed modifications to key functionalities that made the administrative process of
					our web application more efficient.
				</p>
				<p class="mt-3">
					<mark>The final product is a remarkable asset to our company,</mark> offering unparalleled convenience
					and efficiency, enhancing customer experience, and maintaining our reputation among existing clients.
				</p>
			</div>
		</Testimonial>
		<Testimonial author="Yucheng Wang, client of Leadgeek">
			<div slot="content">
				<p>
					The software is awesome... It looks FANTASTIC on my first try! <mark>Great work.</mark>
				</p>
			</div>
		</Testimonial>
		<Testimonial author="John Fernando, client of Leadgeek" class="md:col-span-2 lg:col-span-1">
			<div slot="content">
				<p>
					Seriously, this is <mark>excellent customer service</mark> and you're very reassuring. I'm going
					to mention you to a few friends who might need your service.
				</p>
			</div>
		</Testimonial>
	</ul>
</section>
