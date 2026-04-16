<script lang="ts">
	import Boot from '$lib/components/boot/Boot.svelte';
	import Login from '$lib/components/login/Login.svelte';
	import Terminal from '$lib/components/terminal/Terminal.svelte';
	import { STATE_KEY, appState } from './state';
	const appName = 'kernel://nexus/tk v9.77.105';
	appState.subscribe((value) => {
		if (typeof window === 'undefined') return;
		sessionStorage.setItem(STATE_KEY, JSON.stringify(value));
	});
</script>

{#if $appState.status === 'BOOT'}
	<Boot {appName} />
{:else if $appState.status === 'LOGIN'}
	<Login {appName} />
{:else}
	<Terminal {appName} username={$appState.username!} />
{/if}
