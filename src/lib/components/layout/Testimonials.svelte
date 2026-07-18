<script lang="ts">
	import Testimonial from '$components/layout/Testimonial.svelte';
</script>

<section class="mt-content" aria-labelledby="testimonials-heading">
	<header class="mb-5 border-b-2 border-neutral-900 pb-1.5">
		<h2 id="testimonials-heading" class="header text-2xl font-black">What clients say</h2>
	</header>

	<Testimonial author="Samuel Broadbent, Founder of Transform Writing" featured>
		<div slot="content">
			<p>
				Jake proposed modifications to key functionalities that made the administrative process of
				our web application more efficient.
				<mark>The final product is a remarkable asset to our company,</mark> offering unparalleled convenience
				and efficiency, enhancing customer experience, and maintaining our reputation among existing clients.
			</p>
		</div>
	</Testimonial>

	<div class="mt-5 grid gap-5 md:grid-cols-2">
		<Testimonial author="Yucheng Wang, client of Leadgeek">
			<div slot="content">
				<p>
					The software is awesome... It looks FANTASTIC on my first try! <mark>Great work.</mark>
				</p>
			</div>
		</Testimonial>
		<Testimonial author="John Fernando, client of Leadgeek">
			<div slot="content">
				<p>
					Seriously, this is <mark>excellent customer service</mark> and you're very reassuring. I'm going
					to mention you to a few friends who might need your service.
				</p>
			</div>
		</Testimonial>
	</div>
</section>
