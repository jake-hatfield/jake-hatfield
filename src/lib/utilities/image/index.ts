// packages
import sharp from 'sharp';

export const IMAGE_DIR = '/src/assets/images/rasters';

export const lowResolutionPlaceholder = async ({ source }) => {
	try {
		const image = sharp(source);
		const buffer = await image
			.resize(20)
			.jpeg({
				quality: 50,
				progressive: true,
				optimiseScans: true,
				chromaSubsampling: '4:2:0',
				trellisQuantisation: true,
				quantisationTable: 2,
			})
			.toBuffer({ resolveWithObject: false });
		return `data:image/jpeg;base64,${(await buffer).toString('base64')}`;
	} catch (error) {
		console.error('Error generating low resolution placeholder: ', source);
	}
};
