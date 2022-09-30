export interface Item {
	slug: string;
	createdAt: string;
	updatedAt: string | null;
	excerpt: string;
	hidden: boolean;
	tags: string[];
	title: string;
	html: string;
	css: { code: string; map: null };
	head: string;
}

export interface FinalizedItem extends Item {
	readingTime: string;
}
