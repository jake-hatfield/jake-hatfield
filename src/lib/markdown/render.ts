import { render as renderComponent } from 'svelte/server';

type MarkdownRenderOutput = {
	css: { code: string; map: null };
	head: string;
	html: string;
};

type MarkdownModule = {
	default: {
		render?: () => MarkdownRenderOutput;
	};
	metadata: Record<string, unknown>;
};

export const renderMarkdownModule = (item: MarkdownModule): MarkdownRenderOutput => {
	if (typeof item.default?.render === 'function') {
		return item.default.render();
	}

	const { body, head } = renderComponent(item.default, { props: {} });

	return {
		css: { code: '', map: null },
		head,
		html: body,
	};
};

export type { MarkdownModule };
