<script lang="ts">
	import type { Events } from '../events/bus';
	import { EventBus } from '../events/bus';
	import { EntryController } from './controllers/entry';
	import { Engine, Scene, WebGPUEngine } from '@babylonjs/core';
	import { ViewportManager } from './viewport-manager';
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
			const scene = new Scene(engine);
			const controller = new EntryController({ canvas, scene });
			manager = new ViewportManager({ canvas, engine, bus, scene, controller });
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
