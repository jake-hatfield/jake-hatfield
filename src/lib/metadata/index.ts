// lib
export const isDevEnv = () => {
	if (import.meta.env.MODE === 'development') return true;
	return false;
};

const domain = 'jake-hatfield.com';

const siteUrl = isDevEnv() ? 'http://127.0.0.1:3000' : domain;

export default {
	author: 'Jake Hatfield',
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
		github: 'https://github.com/jake-hatfield?tab=repositories',
		youtube: 'https://www.youtube.com/@jake-hatfield',
	},
};
