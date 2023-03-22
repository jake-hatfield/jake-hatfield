// lib
import { isDevEnv } from '$lib/utilities';

const siteUrl = isDevEnv() ? 'http://127.0.0.1:3000' : 'jake-hatfield.com';

export default {
	author: ' Jake Hatfield',
	description:
		" Jake Hatfield's personal website. check out the thoughts, learnings, and projects currently taking up his time.",
	keywords: [' Jake Hatfield', 'Jacob Hatfield'],
	siteLanguage: 'en',
	ogLanguage: 'en_US',
	siteTitle: ' Jake Hatfield',
	siteShortTitle: ' Jake Hatfield',
	siteUrl: `https://${siteUrl}`,
	email: `me@${siteUrl}`,
	social: {
		github: 'https://github.com/jake-hatfield?tab=repositories',
		youtube: 'https://www.youtube.com/@jake-hatfield',
	},
};
