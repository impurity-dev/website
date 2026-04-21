<script lang="ts">
	import type { Events } from '../events/bus';
	import { EventBus } from '../events/bus';
	import { ViewportManager } from './viewport-manager';
	import { Engine, WebGPUEngine } from '@babylonjs/core';
	type Props = {
		bus: EventBus<Events>;
	};
	let { bus }: Props = $props();
	let canvas = $state<HTMLCanvasElement>(null!);
	let manager = $state<ViewportManager | undefined>(undefined);

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
			manager = new ViewportManager({ canvas, engine, bus });
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
