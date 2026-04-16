import { appState } from './state';

export const setUsername = (username: string) =>
	appState.update((s) => ({
		...s,
		username,
		status: 'READY'
	}));

export const startLogin = () =>
	appState.update((s) => ({
		...s,
		status: 'LOGIN'
	}));

export const reset = () =>
	appState.set({
		status: 'BOOT',
		username: null
	});
