export const getItemImagePath = (image: string) => `/images/items/${image}`;

export const getItemImageSrcset = (image: string) => {
	const base = getItemImagePath(image).replace(/\.jpg$/, '');

	return `${base}-640.webp 640w, ${base}-960.webp 960w, ${base}-1280.webp 1280w`;
};

export const itemImageSizes = '(max-width: 768px) 100vw, (max-width: 1024px) 960px, 1280px';
