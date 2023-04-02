// lib
export const isDevEnv = () => {
	if (import.meta.env.MODE === 'development') return true;
	return false;
};

const domain = 'jake-hatfield.com';

const siteUrl = isDevEnv() ? 'http://127.0.0.1:3000' : domain;

export default {
	author: 'Jake Hatfield',
	createdAt: '2022-10-06T00:00:00.000+0100',
	description:
		"Jake Hatfield's personal website. Check out the thoughts, learnings, and projects currently taking up his time.",
	keywords: [
		'Jake Hatfield',
		'Jacob Hatfield',
		'Full-stack software engineer',
		'Front end software engineer',
		'Back end software engineer',
		'Full-stack web developer',
	],
	siteLanguage: 'en',
	ogLanguage: 'en_US',
	siteTitle: 'Jake Hatfield',
	siteShortTitle: 'Jake Hatfield',
	siteUrl: `https://${siteUrl}`,
	email: `me@${domain}`,
	social: {
		behance: 'https://www.behance.net/jake-hatfield',
		discord: 'https://discord.com/users/280901621850832896',
		dribbble: 'https://dribbble.com/jake-hatfield',
		github: 'https://github.com/jake-hatfield?tab=repositories',
		hackerNews: 'https://news.ycombinator.com/user?id=jake-hatfield',
		spotify: 'https://open.spotify.com/user/jacobmhatfield',
		youtube: 'https://www.youtube.com/@jake-hatfield',
	},
};
