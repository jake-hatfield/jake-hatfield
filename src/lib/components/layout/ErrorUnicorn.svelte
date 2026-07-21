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
	<svg class="unicorn-scene" viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg">
		<defs>
			<linearGradient id="unicorn-horn" x1="0%" y1="100%" x2="100%" y2="0%">
				<stop offset="0%" stop-color="#c084fc" />
				<stop offset="45%" stop-color="#fde047" />
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
			<path class="sparkle sparkle-1" d="M52 42l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fde047" />
			<path class="sparkle sparkle-2" d="M332 58l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#c084fc" />
			<path class="sparkle sparkle-3" d="M348 168l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#a3e635" />
			<path class="sparkle sparkle-4" d="M28 176l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#f472b6" />
		</g>

		<g class="unicorn" class:animate={!prefersReducedMotion}>
			<ellipse class="shadow" cx="210" cy="228" rx="92" ry="10" fill="#4c1d95" opacity="0.45" />

			<!-- Back legs -->
			<path
				d="M252 172 L252 214 Q252 222 260 222 L272 222 Q280 222 280 214 L280 172 Z"
				fill="#e2e8f0"
				stroke="#64748b"
				stroke-width="2"
			/>
			<path
				d="M282 170 L282 216 Q282 224 290 224 L302 224 Q310 224 310 216 L310 170 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2"
			/>
			<rect x="252" y="218" width="28" height="8" rx="2" fill="#475569" />
			<rect x="282" y="220" width="28" height="8" rx="2" fill="#334155" />

			<!-- Tail -->
			<path
				class="tail"
				d="M300 118 C328 112 352 128 358 152 C364 176 352 198 330 206 C318 210 306 204 300 192 C308 184 314 168 312 152 C310 136 304 124 300 118 Z"
				fill="url(#unicorn-mane)"
				stroke="#a855f7"
				stroke-width="1.5"
			/>
			<path
				class="tail-strand"
				d="M334 148 C346 164 348 182 338 198"
				fill="none"
				stroke="#fde047"
				stroke-linecap="round"
				stroke-width="3"
			/>

			<!-- Body -->
			<path
				class="body"
				d="M168 150 C168 118 198 96 242 96 C284 96 312 114 316 142 C320 168 300 186 268 188 L182 188 C156 188 146 172 152 150 C154 140 160 134 168 150 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2.5"
			/>

			<!-- Front legs -->
			<path
				d="M162 168 L162 214 Q162 222 170 222 L182 222 Q190 222 190 214 L190 168 Z"
				fill="#e2e8f0"
				stroke="#64748b"
				stroke-width="2"
			/>
			<path
				d="M192 166 L192 216 Q192 224 200 224 L212 224 Q220 224 220 216 L220 166 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2"
			/>
			<rect x="162" y="218" width="28" height="8" rx="2" fill="#475569" />
			<rect x="192" y="220" width="28" height="8" rx="2" fill="#334155" />

			<!-- Neck and chest -->
			<path
				class="neck"
				d="M168 150 C148 138 128 118 122 92 C116 68 128 48 152 42 C168 38 182 44 192 56 C176 64 166 78 164 96 C162 114 168 132 182 146 C176 148 172 150 168 150 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2.5"
			/>

			<!-- Mane -->
			<path
				class="mane"
				d="M148 44 C132 58 124 78 126 98 C128 118 138 134 154 144 C160 128 162 110 158 92 C154 74 148 58 148 44 Z"
				fill="url(#unicorn-mane)"
				stroke="#a855f7"
				stroke-width="1.5"
			/>
			<path
				class="mane-strand"
				d="M136 62 C128 82 130 104 142 122"
				fill="none"
				stroke="#a3e635"
				stroke-linecap="round"
				stroke-width="3"
			/>
			<path
				class="mane-strand"
				d="M148 70 C142 88 144 108 154 124"
				fill="none"
				stroke="#f472b6"
				stroke-linecap="round"
				stroke-width="3"
			/>

			<!-- Head -->
			<path
				class="head"
				d="M152 42 C128 42 108 58 102 78 C96 98 106 116 126 122 C136 124 146 120 152 110 C158 98 160 84 156 70 C154 58 154 48 152 42 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2.5"
			/>

			<!-- Muzzle -->
			<path
				d="M102 78 C88 78 78 88 80 98 C82 108 94 114 108 110 C114 108 118 102 120 96"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2.5"
			/>
			<ellipse cx="84" cy="96" rx="4" ry="3" fill="#fda4af" />
			<path
				d="M98 102 C106 106 114 106 122 102"
				fill="none"
				stroke="#94a3b8"
				stroke-linecap="round"
				stroke-width="2"
			/>

			<!-- Ear -->
			<path
				class="ear"
				d="M158 36 L172 14 L180 32 L158 40 Z"
				fill="#f8fafc"
				stroke="#64748b"
				stroke-width="2"
			/>
			<path class="ear-inner" d="M164 30 L170 20 L174 32 Z" fill="#fbcfe8" />

			<!-- Horn -->
			<path class="horn" d="M146 36 L156 0 L166 36 L156 46 Z" fill="url(#unicorn-horn)" stroke="#9333ea" stroke-width="1.5" />
			<path
				class="horn-spiral"
				d="M152 12 C158 20 158 28 152 36"
				fill="none"
				stroke="#ffffff"
				stroke-linecap="round"
				stroke-width="2"
				opacity="0.75"
			/>
			<path
				class="horn-spiral"
				d="M160 8 C164 18 164 28 160 38"
				fill="none"
				stroke="#ffffff"
				stroke-linecap="round"
				stroke-width="1.5"
				opacity="0.55"
			/>

			<!-- Eye -->
			<circle cx="128" cy="82" r="6.5" fill="#1e1b4b" />
			<circle cx="130" cy="80" r="2.2" fill="#ffffff" />
			<path
				d="M118 72 C126 66 136 66 144 72"
				fill="none"
				stroke="#94a3b8"
				stroke-linecap="round"
				stroke-width="2"
			/>
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
		transform-origin: 210px 210px;
	}

	.unicorn.animate .tail,
	.unicorn.animate .tail-strand {
		animation: tail-swish 1.2s ease-in-out infinite alternate;
		transform-origin: 300px 118px;
	}

	.unicorn.animate .mane,
	.unicorn.animate .mane-strand {
		animation: mane-flow 1.8s ease-in-out infinite alternate;
		transform-origin: 148px 44px;
	}

	.unicorn.animate .horn,
	.unicorn.animate .horn-spiral {
		animation: horn-glow 2s ease-in-out infinite;
		transform-origin: 156px 36px;
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

	@keyframes unicorn-bounce {
		0%,
		100% {
			transform: translateY(0);
		}

		35% {
			transform: translateY(-6px);
		}

		70% {
			transform: translateY(-3px);
		}
	}

	@keyframes tail-swish {
		from {
			transform: rotate(-8deg);
		}

		to {
			transform: rotate(10deg);
		}
	}

	@keyframes mane-flow {
		from {
			transform: rotate(-3deg);
		}

		to {
			transform: rotate(4deg);
		}
	}

	@keyframes horn-glow {
		0%,
		100% {
			filter: drop-shadow(0 0 0 rgb(163 230 53 / 0));
		}

		50% {
			filter: drop-shadow(0 0 8px rgb(163 230 53 / 0.85));
		}
	}

	@keyframes shadow-pulse {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 0.45;
		}

		50% {
			transform: scaleX(0.88);
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

	@media (prefers-reduced-motion: reduce) {
		.unicorn.animate,
		.unicorn.animate .tail,
		.unicorn.animate .tail-strand,
		.unicorn.animate .mane,
		.unicorn.animate .mane-strand,
		.unicorn.animate .horn,
		.unicorn.animate .horn-spiral,
		.unicorn.animate .shadow,
		.sparkles.animate .sparkle {
			animation: none;
		}
	}
</style>
