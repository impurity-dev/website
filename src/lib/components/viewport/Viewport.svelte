<script lang="ts">
	import { Manager } from './manager';
	import { Engine, WebGPUEngine } from '@babylonjs/core';

	let canvas = $state<HTMLCanvasElement>(null!);
	let manager = $state<Manager | undefined>(undefined);

	const createEngine = async () => {
		if (navigator.gpu) {
			const engine = new WebGPUEngine(canvas, { antialias: true, adaptToDeviceRatio: true });
			await engine.initAsync();
			return engine;
		}
		return new Engine(canvas, true, { preserveDrawingBuffer: false });
	};

	$effect(() => {
		if (!canvas) return;
		let disposed = false;

		createEngine().then((engine) => {
			if (disposed) {
				engine.dispose();
				return;
			}
			manager = new Manager(canvas, engine);
			manager.run();
		});

		const resize = () => manager?.resize();
		window.addEventListener('resize', resize);

		return () => {
			disposed = true;
			window.removeEventListener('resize', resize);
			manager?.dispose();
		};
	});
</script>

<canvas class="block h-full w-full" bind:this={canvas}></canvas>
