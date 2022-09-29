export interface Item {
	slug: string;
	date: string;
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
