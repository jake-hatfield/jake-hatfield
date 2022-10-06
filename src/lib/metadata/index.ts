// lib
import { isDevEnv } from '$lib/utilities';

const siteUrl = isDevEnv() ? 'http://127.0.0.1:3000/' : 'jake-hatfield.com';

export default {
	author: 'jake hatfield',
	description:
		"jake hatfield's personal website. check out the thoughts, learnings, and projects currently taking up his time.",
	keywords: ['jake hatfield', 'jacob hatfield'],
	siteLanguage: 'en',
	ogLanguage: 'en_US',
	siteTitle: 'jake hatfield',
	siteShortTitle: 'jake hatfield',
	siteUrl: `https://${siteUrl}`,
	email: `me@${siteUrl}`,
	social: {
		github: 'https://github.com/jake-hatfield',
		youtube: 'https://www.youtube.com/channel/UCRiYp0i1khDxjJPD9-nd7zw',
	},
};
