import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe('Jake Hatfield');
});

test('resume link loads the PDF', async ({ page }) => {
	await page.goto('/');

	const [response] = await Promise.all([
		page.waitForResponse(
			(res) => res.url().includes('/resume.pdf') && res.status() === 200,
		),
		page.getByRole('link', { name: 'View my resume' }).click(),
	]);

	expect(response.headers()['content-type']).toContain('application/pdf');
});
