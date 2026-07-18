// assets
import type { ComponentType, SvelteComponent } from 'svelte';

type SkillIcon = ComponentType<SvelteComponent<{ height?: number; width?: number }>>;

const skill = (title: string, icon: () => Promise<{ default: SkillIcon }>) => ({
	title,
	icon,
});

export const future = [
	skill('Go', () => import('$assets/images/vectors/LogoGo.svelte')),
	skill('Elixir', () => import('$assets/images/vectors/LogoElixir.svelte')),
];

export const technical = [
	skill('HTML', () => import('$assets/images/vectors/LogoHTML.svelte')),
	skill('CSS', () => import('$assets/images/vectors/LogoCSS.svelte')),
	skill('JavaScript', () => import('$assets/images/vectors/LogoJavaScript.svelte')),
	skill('TypeScript', () => import('$assets/images/vectors/LogoTypeScript.svelte')),
	skill('jQuery', () => import('$assets/images/vectors/LogoJquery.svelte')),
	skill('PHP', () => import('$assets/images/vectors/LogoPHP.svelte')),
	skill('Python', () => import('$assets/images/vectors/LogoPython.svelte')),
	skill('Node.js', () => import('$assets/images/vectors/LogoNodeJS.svelte')),
	skill('Express.js', () => import('$assets/images/vectors/LogoExpress.svelte')),
	skill('NestJS', () => import('$assets/images/vectors/LogoNestJs.svelte')),
	skill('Django', () => import('$assets/images/vectors/LogoDjango.svelte')),
	skill('React / React Native', () => import('$assets/images/vectors/LogoReact.svelte')),
	skill('Redux', () => import('$assets/images/vectors/LogoRedux.svelte')),
	skill('Next.js', () => import('$assets/images/vectors/LogoNextJS.svelte')),
	skill('Gatsby', () => import('$assets/images/vectors/LogoGatsby.svelte')),
	skill('Svelte / SvelteKit', () => import('$assets/images/vectors/LogoSvelte.svelte')),
	skill('Vue', () => import('$assets/images/vectors/LogoVue.svelte')),
	skill('Angular', () => import('$assets/images/vectors/LogoAngular.svelte')),
	skill('TailwindCSS', () => import('$assets/images/vectors/LogoTailwindCSS.svelte')),
	skill('GraphQL', () => import('$assets/images/vectors/LogoGraphQL.svelte')),
	skill('Prisma', () => import('$assets/images/vectors/LogoPrisma.svelte')),
	skill('Supabase', () => import('$assets/images/vectors/LogoSupabase.svelte')),
	skill('Firebase', () => import('$assets/images/vectors/LogoFirebase.svelte')),
	skill('MongoDB', () => import('$assets/images/vectors/LogoMongoDB.svelte')),
	skill('PostgreSQL', () => import('$assets/images/vectors/LogoPostgres.svelte')),
	skill('Vitest', () => import('$assets/images/vectors/LogoVitest.svelte')),
	skill('Jest', () => import('$assets/images/vectors/LogoJest.svelte')),
	skill('Playwright', () => import('$assets/images/vectors/LogoPlaywright.svelte')),
	skill('Testing Library', () => import('$assets/images/vectors/LogoTestingLibrary.svelte')),
	skill('D3.js', () => import('$assets/images/vectors/LogoD3JS.svelte')),
	skill('Maizzle', () => import('$assets/images/vectors/LogoMaizzle.svelte')),
	skill('OpenAI', () => import('$assets/images/vectors/LogoOpenAI.svelte')),
	skill('Expo', () => import('$assets/images/vectors/LogoExpo.svelte')),
	skill('ngrok', () => import('$assets/images/vectors/LogoNgrok.svelte')),
	skill('Git', () => import('$assets/images/vectors/LogoGit.svelte')),
	skill('Github Actions', () => import('$assets/images/vectors/LogoGithubActions.svelte')),
	skill('Docker', () => import('$assets/images/vectors/LogoDocker.svelte')),
	skill('Kubernetes', () => import('$assets/images/vectors/LogoKubernetes.svelte')),
	skill('Sentry', () => import('$assets/images/vectors/LogoSentry.svelte')),
	skill('Heroku', () => import('$assets/images/vectors/LogoHeroku.svelte')),
	skill('Netlify', () => import('$assets/images/vectors/LogoNetlify.svelte')),
	skill('Vercel', () => import('$assets/images/vectors/LogoVercel.svelte')),
	skill('Railway', () => import('$assets/images/vectors/LogoRailway.svelte')),
	skill('WordPress', () => import('$assets/images/vectors/LogoWordpress.svelte')),
	skill('Stripe', () => import('$assets/images/vectors/LogoStripe.svelte')),
	skill('Twilio', () => import('$assets/images/vectors/LogoTwilio.svelte')),
];

export const creative = [
	skill('Postman', () => import('$assets/images/vectors/LogoPostman.svelte')),
	skill('Adobe After Effects', () => import('$assets/images/vectors/LogoAdobeAfterEffects.svelte')),
	skill('Adobe Illustrator', () => import('$assets/images/vectors/LogoAdobeIllustrator.svelte')),
	skill('Adobe Photoshop', () => import('$assets/images/vectors/LogoAdobePhotoshop.svelte')),
	skill('Adobe Premiere Pro', () => import('$assets/images/vectors/LogoAdobePremierePro.svelte')),
	skill('Adobe XD', () => import('$assets/images/vectors/LogoAdobeXD.svelte')),
	skill('Figma', () => import('$assets/images/vectors/LogoFigma.svelte')),
	skill('Google Ads', () => import('$assets/images/vectors/LogoGoogleAds.svelte')),
	skill('Google Analytics', () => import('$assets/images/vectors/LogoGoogleAnalytics.svelte')),
	skill('Fathom Analytics', () => import('$assets/images/vectors/LogoFathom.svelte')),
	skill('Slack', () => import('$assets/images/vectors/LogoSlack.svelte')),
	skill('Visual Studio Code', () => import('$assets/images/vectors/LogoVisualStudioCode.svelte')),
];
