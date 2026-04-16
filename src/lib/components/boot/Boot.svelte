<script lang="ts">
	import { startLogin } from '../../../routes/actions';
	type Props = {
		appName: string;
	};

	let { appName }: Props = $props();

	let displayed = $state('');
	let cursorVisible = $state(true);

	const runtime = {
		timeouts: new Set<number>(),
		intervals: new Set<number>()
	};

	const lines = [
		'initializing system...',
		'loading core modules...',
		'starting runtime environment...',
		'mounting virtual filesystem...',
		'establishing UI layer...',
		'system ready'
	];

	const sleep = (ms: number) =>
		new Promise<void>((resolve) => {
			const id = window.setTimeout(() => {
				runtime.timeouts.delete(id);
				resolve();
			}, ms);
			runtime.timeouts.add(id);
		});
	const blink = (ms: number) => {
		const id = window.setInterval(() => {
			cursorVisible = !cursorVisible;
		}, ms);
		runtime.intervals.add(id);
	};

	const type = async (text: string) => {
		displayed = '';
		for (let i = 0; i <= text.length; i++) {
			displayed = text.slice(0, i);
			await sleep(35);
		}
	};

	$effect(() => {
		let running = true;
		blink(500);
		const animate = async () => {
			if (!running) return;
			for (const line of lines) {
				await type(line);
				await sleep(700);
			}

			await sleep(900);
			console.log('here');
			startLogin();
		};
		animate();

		return () => {
			running = false;
			for (const id of runtime.timeouts) clearTimeout(id);
			for (const id of runtime.intervals) clearInterval(id);
			runtime.timeouts.clear();
			runtime.intervals.clear();
		};
	});
</script>

<div class="boot">
	<div class="container">
		<pre class="ascii">
{appName}
───────────────────────────
		</pre>

		<pre class="line">
{displayed}<span class="cursor">{cursorVisible ? '▌' : ' '}</span>
		</pre>
	</div>
</div>

<style>
	.container {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 16px;
		align-items: center;
	}

	.boot {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-hacker-bg);
		color: var(--color-hacker-text);
		font-family: var(--font-mono);
	}
	.ascii {
		color: var(--color-hacker-primary-soft);
		text-shadow: var(--shadow-hacker);
		white-space: pre;
	}

	.line {
		font-size: 14px;
		white-space: pre;
		color: var(--color-hacker-text);
	}

	.cursor {
		color: var(--color-hacker-primary);
		animation: glow 1s infinite;
	}

	@keyframes glow {
		0% {
			text-shadow: 0 0 6px var(--color-hacker-glow);
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
		100% {
			text-shadow: 0 0 12px var(--color-hacker-glow);
			opacity: 1;
		}
	}
</style>
