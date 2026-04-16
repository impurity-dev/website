import { writable } from 'svelte/store';

export type AppState = {
	status: 'BOOT' | 'LOGIN' | 'READY';
	username: string | null;
};
export const STATE_KEY = 'state';

const load = (): AppState => {
	if (typeof window === 'undefined') {
		return { status: 'BOOT', username: null };
	}

	const raw = sessionStorage.getItem(STATE_KEY);
	if (!raw) return { status: 'BOOT', username: null };

	try {
		return JSON.parse(raw);
	} catch {
		return { status: 'BOOT', username: null };
	}
};

export const appState = writable<AppState>(load());
