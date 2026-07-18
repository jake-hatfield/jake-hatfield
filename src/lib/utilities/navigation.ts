export const isStaticAssetPath = (href: string) => {
	if (!href || href.startsWith('http')) return false;

	const path = href.split('?')[0]?.split('#')[0] ?? '';

	return /\.[a-z0-9]+$/i.test(path);
};
