// types
import type ProgressBarRound from 'carbon-icons-svelte/lib/ProgressBarRound.svelte';

export interface EmptyState {
	button?: {
		href: string;
		icon?: typeof ProgressBarRound;
		onClick?: () => void;
		title: string;
	};
	description: string;
	icon: typeof ProgressBarRound;
	title: string;
}
