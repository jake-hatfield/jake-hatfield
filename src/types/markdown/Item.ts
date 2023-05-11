export interface Item {
	createdAt: string;
	description: string;
	css: { code: string; map: null };
	head: string;
	html: string;
	image: string;
	hidden: boolean;
	hiddenRepo: boolean;
	isIndexed: boolean;
	repository: string | null;
	site: string | null;
	slug: string;
	summary: string;
	tag: string;
	title: string;
	updatedAt: string | null;
}

export interface FinalizedItem extends Item {
	readingTime: string;
	type: Types;
}

export type Types = 'articles' | 'changelogs' | 'projects';
