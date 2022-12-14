// types
import type EndpointError from '$types/Error';

export const createApiError = (status: number, e: unknown, body?: any) => {
	let error: EndpointError;

	if (typeof e === 'string') {
		error = { message: e };
	} else if (e?.message) {
		error = { message: e.message };
		if (e?.code) {
			error.code = e.code;
		}
		if (e?.suggestion) {
			error.suggestion = e.suggestion;
		}
	} else {
		error = { message: "Unhandled error! Something went wrong, but I can't tell ya what" };
	}

	return new Response(
		JSON.stringify({
			...body,
			error
		}),
		{ status }
	);
};

export const createConsoleError = (pathname: string, errorMessage: string) => {
	console.error(
		`/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/\nš Error in ${pathname}\n${errorMessage}\n/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/`
	);
};

export const handleApiError = (pathname: string, status: number, e: unknown, body: any) => {
	if (typeof e === 'string') {
		createConsoleError(pathname, `š¬ ${e}`);
	} else if (e?.message) {
		createConsoleError(
			`${pathname}: ${status}`,
			`${e?.code ? `ā ${e.code}\n` : ''}š¬ ${e.message}${
				e?.suggestion ? `\nš¤ ${e.suggestion}` : ''
			}`
		);
	} else {
		createConsoleError(
			pathname,
			"š¬ Unhandled error! Something went wrong, but I can't tell ya what"
		);
	}

	return createApiError(status, e, body);
};
