export interface Item {
	createdAt: string;
	description: string;
	css: { code: string; map: null };
	head: string;
	html: string;
	image: string;
	excerpt: string;
	hidden: boolean;
	slug: string;
	tags: string[];
	title: string;
	updatedAt: string | null;
}

export interface FinalizedItem extends Item {
	readingTime: string;
	type: Types;
}

export type Types = 'articles' | 'changelogs' | 'projects';
