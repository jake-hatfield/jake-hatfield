import metadata from '$lib/metadata';

type PageSeoProps = {
	breadcrumbs?: { title: string; slug: string }[];
	metaDescription: string;
	readingTime?: string;
	slug: string;
	title: string;
};

export const getPageSeoProps = ({
	breadcrumbs,
	metaDescription,
	readingTime = '5 mins.',
	slug,
	title,
}: PageSeoProps) => ({
	breadcrumbs: breadcrumbs ?? [{ title, slug }],
	createdAt: metadata.createdAt,
	metaDescription,
	readingTime,
	slug,
	title,
	updatedAt: metadata.updatedAt,
});
