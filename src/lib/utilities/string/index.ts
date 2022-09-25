// capitalize the first letter of a string
export const capitalize = (string: string): string => {
	return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

export const kebabCase = (string: string) =>
	string
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\s+/g, '-')
		.toLowerCase();

export const pluralize = (count: number, noun: string, suffix = 's') =>
	`${count} ${noun}${count !== 1 ? suffix : ''}`;

export const sentenceCase = (string: string) => {
	return kebabCase(string)
		.split('-')
		.map((word) => {
			return word.slice(0, 1).toUpperCase() + word.slice(1);
		})
		.join(' ');
};
