import type { Types } from '$types/markdown/Item';

export const itemListMeta: Record<
	Types,
	{
		metaDescription: string;
		title: string;
	}
> = {
	projects: {
		metaDescription: 'See what Jake Hatfield is working on.',
		title: 'Work',
	},
	articles: {
		metaDescription: 'Read what Jake Hatfield is learning about.',
		title: 'Writing',
	},
	changelogs: {
		metaDescription: 'Read what Jake Hatfield is thinking about.',
		title: 'Changelogs',
	},
};
