<script lang="ts">
	import Boot from '$lib/components/boot/Boot.svelte';
	import Interactive from '$lib/components/interactive/Interactive.svelte';
	import Login from '$lib/components/login/Login.svelte';
	import Terminal from '$lib/components/terminal/Terminal.svelte';
	import { STATE_KEY, appState } from './state';
	const appName = 'kernel://nexus/tk v9.77.105';
	appState.subscribe((value) => {
		if (typeof window === 'undefined') return;
		sessionStorage.setItem(STATE_KEY, JSON.stringify(value));
	});

	let mounted = $state(false);
	let Viewport = $state<any>(null);
	$effect(() => {
		(async () => {
			const mod = await import('$lib/components/viewport/Viewport.svelte');
			Viewport = mod.default;
			mounted = true;
		})();
	});
</script>

{#if $appState.status === 'BOOT'}
	<Boot {appName} />
{:else if $appState.status === 'LOGIN'}
	<Login />
{:else if mounted}
	<Interactive>
		{#snippet viewport()}
			<Viewport />
		{/snippet}
		{#snippet terminal()}
			<Terminal {appName} username={$appState.username!} />
		{/snippet}
	</Interactive>
{:else}
	<div>loading...</div>
{/if}
