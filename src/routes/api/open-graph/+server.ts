// packages
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import { render } from 'svelte/server';

// components
import OpenGraphImage from '$components/utilities/seo/OpenGraphImage.svelte';

// lib
import { handleApiError } from '$lib/utilities/api';
import IBMPlexMono from '$lib/fonts/IBMPlexMono-Bold.ttf';

// types
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const description = url.searchParams.get('description');
		let format = url.searchParams.get('format');
		const title = url.searchParams.get('title');

		if (!format) format = 'square';

		let width = 600;
		let height = 600;

		if (format === 'rect') {
			width = 1200;
			height = 630;
		} else if (format === 'rectAlt') {
			width = 1200;
			height = 600;
		}

		const { body } = render(OpenGraphImage, {
			props: { description, format, title },
		});
		const element = html(body);

		const svg = await satori(element, {
			fonts: [{ name: 'IBM Plex Mono', data: Buffer.from(IBMPlexMono) }],
			width,
			height,
		});

		const resvg = new Resvg(svg, {
			fitTo: {
				mode: 'width',
				value: width,
			},
		});

		const image = resvg.render();

		return new Response(image.asPng(), {
			headers: {
				'content-type': 'image/png',
			},
		});
	} catch (error) {
		console.log(error);
		return handleApiError(url.pathname, 500, { error }, {});
	}
};
