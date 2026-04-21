import { AbstractEngine, Scene } from '@babylonjs/core';
import { PUBLIC_ATTACH_INSPECTOR } from '$env/static/public';
import { ShowInspector, type InspectorToken } from '@babylonjs/inspector';
import { VirtualController } from './controller';
import type { EventBus, Events } from '../events/bus';

export type ManagerProps = {
	canvas: HTMLCanvasElement;
	engine: AbstractEngine;
	bus: EventBus<Events>;
};

export class Manager {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: AbstractEngine;
	private readonly scene: Scene;
	private readonly token: InspectorToken | undefined;
	private readonly controller: VirtualController;
	private readonly bus: EventBus<Events>;
	private readonly subscriptions: (() => void)[] = [];

	constructor(props: ManagerProps) {
		const { canvas, engine, bus } = props;
		this.canvas = canvas;
		this.engine = engine;
		this.bus = bus;
		this.scene = new Scene(this.engine);
		if (PUBLIC_ATTACH_INSPECTOR === 'true') this.token = ShowInspector(this.scene);
		const args = { canvas: this.canvas, scene: this.scene };
		this.controller = new VirtualController(args);
		this.controller.onEnter();
		const unsub = this.bus.on('goto', (args) => this.controller.goTo(args));
		this.subscriptions.push(unsub);
	}

	resize = () => this.engine.resize();
	run = () =>
		this.engine.runRenderLoop(() => {
			if (!this.controller) return;
			const dt = this.engine.getDeltaTime() / 1_000;
			this.controller.onUpdate(dt);
			this.scene.render();
		});
	dispose = () => {
		this.token?.dispose();
		this.scene.dispose();
		this.engine.dispose();
	};
}
