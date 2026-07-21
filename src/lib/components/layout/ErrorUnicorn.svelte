<script lang="ts">
	import { onMount } from 'svelte';

	let prefersReducedMotion = false;

	onMount(() => {
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});
</script>

<div
	class="error-unicorn mx-auto mt-8 w-full max-w-md border-2 border-violet-700 bg-violet-950/40 p-6"
	aria-hidden="true"
>
	<svg class="unicorn-scene" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="unicorn-horn" x1="0%" y1="100%" x2="100%" y2="0%">
				<stop offset="0%" stop-color="#c084fc" />
				<stop offset="50%" stop-color="#fde047" />
				<stop offset="100%" stop-color="#a3e635" />
			</linearGradient>
			<linearGradient id="unicorn-mane" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#a3e635" />
				<stop offset="35%" stop-color="#c084fc" />
				<stop offset="65%" stop-color="#f472b6" />
				<stop offset="100%" stop-color="#fde047" />
			</linearGradient>
		</defs>

		<g class="sparkles" class:animate={!prefersReducedMotion}>
			<path class="sparkle sparkle-1" d="M44 36l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fde047" />
			<path class="sparkle sparkle-2" d="M268 52l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#c084fc" />
			<path class="sparkle sparkle-3" d="M286 148l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#a3e635" />
			<path class="sparkle sparkle-4" d="M36 168l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#f472b6" />
		</g>

		<g class="unicorn" class:animate={!prefersReducedMotion}>
			<ellipse class="shadow" cx="160" cy="206" rx="72" ry="10" fill="#4c1d95" opacity="0.45" />

			<path
				class="tail"
				d="M228 132c18 8 34 18 42 34 6 12 4 28-8 36-10 6-24 2-30-8-4-8-4-18 0-28 4-10 10-18 18-24"
				fill="url(#unicorn-mane)"
			/>

			<path
				class="body"
				d="M108 118c0-28 22-52 52-52s52 24 52 52c0 18-8 34-20 44l-8 36h-48l-8-36c-12-10-20-26-20-44z"
				fill="#f8fafc"
			/>
			<path
				d="M136 92c8-10 20-14 32-12 10 2 18 10 22 20"
				fill="none"
				stroke="#e2e8f0"
				stroke-linecap="round"
				stroke-width="3"
			/>

			<path
				class="neck"
				d="M132 92c-18 2-32 16-36 34-4 18 2 36 14 48"
				fill="#f8fafc"
			/>

			<path
				class="mane"
				d="M96 78c-8 14-12 30-10 46 2 14 8 26 18 34 4-12 6-24 4-36-2-12-6-24-12-34 6-4 10-8 0-10z"
				fill="url(#unicorn-mane)"
			/>

			<path
				class="head"
				d="M92 86c-14 8-24 24-22 40 2 14 12 24 26 26 16 2 30-6 36-20 6-14 2-30-10-40-12-10-22-12-30-6z"
				fill="#f8fafc"
			/>

			<path class="snout" d="M56 118c-10 2-16 10-14 18 2 8 12 12 22 10" fill="#f8fafc" />
			<circle cx="54" cy="126" r="3" fill="#fda4af" />
			<circle cx="82" cy="104" r="5" fill="#1e1b4b" />
			<circle cx="84" cy="102" r="1.5" fill="#ffffff" />
			<path
				d="M68 118c4 4 10 6 16 4"
				fill="none"
				stroke="#cbd5e1"
				stroke-linecap="round"
				stroke-width="2"
			/>

			<path class="ear" d="M98 72l10-18 8 14-18 4z" fill="#f8fafc" />
			<path class="ear-inner" d="M104 68l4-8 4 8-8 2z" fill="#fbcfe8" />

			<path class="horn" d="M108 58l8-34 8 34-8 8z" fill="url(#unicorn-horn)" />

			<g class="legs">
				<rect x="124" y="168" width="12" height="34" rx="6" fill="#f8fafc" />
				<rect x="148" y="168" width="12" height="34" rx="6" fill="#f8fafc" />
				<rect x="172" y="168" width="12" height="34" rx="6" fill="#f8fafc" />
				<rect x="196" y="168" width="12" height="34" rx="6" fill="#f8fafc" />
				<rect x="124" y="196" width="12" height="8" rx="4" fill="#cbd5e1" />
				<rect x="148" y="196" width="12" height="8" rx="4" fill="#cbd5e1" />
				<rect x="172" y="196" width="12" height="8" rx="4" fill="#cbd5e1" />
				<rect x="196" y="196" width="12" height="8" rx="4" fill="#cbd5e1" />
			</g>
		</g>

		<g class="rainbow-trail" class:animate={!prefersReducedMotion}>
			<path d="M24 208c40-18 88-18 128 0" fill="none" stroke="#a3e635" stroke-linecap="round" stroke-width="4" />
			<path d="M32 214c36-12 80-12 116 0" fill="none" stroke="#c084fc" stroke-linecap="round" stroke-width="4" />
			<path d="M40 220c32-8 72-8 104 0" fill="none" stroke="#f472b6" stroke-linecap="round" stroke-width="4" />
		</g>
	</svg>
</div>

<style>
	.error-unicorn {
		overflow: hidden;
	}

	.unicorn-scene {
		display: block;
		width: 100%;
		height: auto;
	}

	.unicorn.animate {
		animation: unicorn-bounce 2.4s ease-in-out infinite;
		transform-origin: 160px 190px;
	}

	.unicorn.animate .tail {
		animation: tail-swish 1.2s ease-in-out infinite alternate;
		transform-origin: 228px 132px;
	}

	.unicorn.animate .mane {
		animation: mane-flow 1.8s ease-in-out infinite alternate;
		transform-origin: 96px 78px;
	}

	.unicorn.animate .horn {
		animation: horn-glow 2s ease-in-out infinite;
		transform-origin: 116px 58px;
	}

	.unicorn.animate .shadow {
		animation: shadow-pulse 2.4s ease-in-out infinite;
	}

	.sparkles.animate .sparkle {
		animation: sparkle-twinkle 1.6s ease-in-out infinite;
	}

	.sparkles.animate .sparkle-2 {
		animation-delay: 0.4s;
	}

	.sparkles.animate .sparkle-3 {
		animation-delay: 0.8s;
	}

	.sparkles.animate .sparkle-4 {
		animation-delay: 1.2s;
	}

	.rainbow-trail.animate {
		animation: trail-shift 2.4s ease-in-out infinite;
	}

	@keyframes unicorn-bounce {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}

		35% {
			transform: translateY(-8px) rotate(-1.5deg);
		}

		70% {
			transform: translateY(-4px) rotate(1deg);
		}
	}

	@keyframes tail-swish {
		from {
			transform: rotate(-6deg);
		}

		to {
			transform: rotate(8deg);
		}
	}

	@keyframes mane-flow {
		from {
			transform: rotate(-4deg) scale(1);
		}

		to {
			transform: rotate(5deg) scale(1.03);
		}
	}

	@keyframes horn-glow {
		0%,
		100% {
			transform: scale(1);
			filter: drop-shadow(0 0 0 rgb(163 230 53 / 0));
		}

		50% {
			transform: scale(1.05);
			filter: drop-shadow(0 0 6px rgb(163 230 53 / 0.8));
		}
	}

	@keyframes shadow-pulse {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 0.45;
		}

		50% {
			transform: scaleX(0.85);
			opacity: 0.25;
		}
	}

	@keyframes sparkle-twinkle {
		0%,
		100% {
			transform: scale(0.7) rotate(0deg);
			opacity: 0.35;
		}

		50% {
			transform: scale(1.1) rotate(20deg);
			opacity: 1;
		}
	}

	@keyframes trail-shift {
		0%,
		100% {
			transform: translateX(0);
			opacity: 0.55;
		}

		50% {
			transform: translateX(6px);
			opacity: 0.9;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.unicorn.animate,
		.unicorn.animate .tail,
		.unicorn.animate .mane,
		.unicorn.animate .horn,
		.unicorn.animate .shadow,
		.sparkles.animate .sparkle,
		.rainbow-trail.animate {
			animation: none;
		}
	}
</style>
