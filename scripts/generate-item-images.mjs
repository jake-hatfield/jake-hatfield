import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const widths = [640, 960, 1280];
const itemsDir = path.resolve('static/images/items');

const walk = async (dir) => {
	for (const entry of fs.readdirSync(dir)) {
		const fullPath = path.join(dir, entry);
		const stats = fs.statSync(fullPath);

		if (stats.isDirectory()) {
			await walk(fullPath);
			continue;
		}

		if (!entry.endsWith('.jpg')) continue;

		const basePath = fullPath.replace(/\.jpg$/, '');

		for (const width of widths) {
			const outputPath = `${basePath}-${width}.webp`;

			await sharp(fullPath)
				.resize({ width, withoutEnlargement: true })
				.webp({ quality: 82 })
				.toFile(outputPath);
		}
	}
};

await walk(itemsDir);
