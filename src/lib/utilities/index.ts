export const isDevEnv = () => {
	if (import.meta.env.MODE === 'development') return true;
	return false;
};
