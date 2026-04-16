<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="app">
	{@render children()}
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		font-family: var(--font-mono);
		background-color: var(--color-hacker-bg);
		color: var(--color-hacker-primary);
	}

	/* 🔥 optional glow ambience */
	.app::before {
		content: '';
		position: fixed;
		inset: 0;
		background: radial-gradient(circle at top, rgba(34, 197, 94, 0.08), transparent 60%);
		pointer-events: none;
	}

	/* 🔥 optional scanlines */
	.app::after {
		content: '';
		position: fixed;
		inset: 0;
		background: repeating-linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 1px,
			transparent 2px,
			transparent 4px
		);
		pointer-events: none;
	}
</style>
