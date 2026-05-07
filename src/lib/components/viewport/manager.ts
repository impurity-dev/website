import { AbstractEngine, Scene } from '@babylonjs/core';
import { EntryController } from './controllers/entry.ts';
import type { EventBus, Events } from '../events/bus.ts';
import { DisposableManager } from './shared/disposable.js';
import { Inspector } from './shared/inspector.js';
import type { ShaderManager } from './shaders/manager.ts';

export type ViewportManagerProps = {
	canvas: HTMLCanvasElement;
	scene: Scene;
	engine: AbstractEngine;
	bus: EventBus<Events>;
	controller: EntryController;
	shaders: ShaderManager;
};

export class ViewportManager {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: AbstractEngine;
	private readonly scene: Scene;
	private readonly controller: EntryController;
	private readonly bus: EventBus<Events>;
	private readonly disposable: DisposableManager;
	private readonly inspector: Inspector;
	private readonly shaders: ShaderManager;

	constructor(props: ViewportManagerProps) {
		const { canvas, engine, scene, bus, controller, shaders } = props;
		this.canvas = canvas;
		this.engine = engine;
		this.bus = bus;
		this.disposable = new DisposableManager();
		this.scene = scene;
		this.controller = controller;
		this.shaders = shaders;
		this.inspector = new Inspector({ scene });
		this.inspector.attach();
		const unsub = this.bus.on('goto', (args) => this.controller.goTo(args));
		this.disposable.addSubscriber(unsub);
	}

	resize = () => this.engine.resize();

	run = async () => {
		await this.shaders.load();
		await this.controller.onEnter();
		this.engine.runRenderLoop(() => {
			if (!this.controller) return;
			const dt = this.engine.getDeltaTime() / 1_000;
			this.controller.onUpdate(dt);
			this.scene.render();
		});
	};

	dispose = async () => {
		this.inspector.dispose();
		this.disposable.dispose();
		this.controller.onExit();
		this.scene.dispose();
		this.engine.dispose();
	};
}
