// packages
import sharp from 'sharp';

export const IMAGE_DIR = '/src/assets/images/rasters';

export const dominantColor = async ({ source }) => {
	try {
		const image = sharp(source);
		const { dominant } = await image.stats();
		return dominant;
	} catch (error) {
		console.error('Error determining dominant color: ', source);
	}
};

export const dominantColorPlaceholder = async ({ source }) => {
	try {
		const dominant = await dominantColor({ source });

		if (dominant) {
			const { r, g, b } = dominant;
			const buffer = await sharp({
				create: {
					width: 2,
					height: 2,
					channels: 3,
					background: { r, g, b }
				}
			})
				.jpeg()
				.toBuffer({ resolveWithObject: false });
			return `data:image/jpeg;base64,${buffer.toString('base64')}`;
		}
	} catch (error) {
		console.error('Error determining dominant color: ', source);
	}
};

export const lowResolutionPlaceholder = async ({ source }) => {
	try {
		const image = sharp(source);
		const buffer = await image
			.resize(20)
			.png({
				progressive: true
			})
			.toBuffer({ resolveWithObject: false });
		return `data:image/jpeg;base64,${(await buffer).toString('base64')}`;
	} catch (error) {
		console.error('Error generating low resolution placeholder: ', source);
	}
};
