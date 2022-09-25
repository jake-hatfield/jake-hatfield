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
		`/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/\n👇 Error in ${pathname}\n${errorMessage}\n/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/`
	);
};

export const handleApiError = (pathname: string, status: number, e: unknown, body: any) => {
	if (typeof e === 'string') {
		createConsoleError(pathname, `💬 ${e}`);
	} else if (e?.message) {
		createConsoleError(
			`${pathname}: ${status}`,
			`${e?.code ? `❌ ${e.code}\n` : ''}💬 ${e.message}${
				e?.suggestion ? `\n🤔 ${e.suggestion}` : ''
			}`
		);
	} else {
		createConsoleError(
			pathname,
			"💬 Unhandled error! Something went wrong, but I can't tell ya what"
		);
	}

	return createApiError(status, e, body);
};
