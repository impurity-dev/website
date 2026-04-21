import { AbstractEngine, KeyboardEventTypes, KeyboardInfo, Observer, Scene } from '@babylonjs/core';
import { PUBLIC_ATTACH_INSPECTOR } from '$env/static/public';
import { ShowInspector, type InspectorToken } from '@babylonjs/inspector';
import { SceneController } from './scene-controller.ts';
import type { EventBus, Events } from '../events/bus';

export type ViewportManagerProps = {
	canvas: HTMLCanvasElement;
	engine: AbstractEngine;
	bus: EventBus<Events>;
};

export class ViewportManager {
	private readonly canvas: HTMLCanvasElement;
	private readonly engine: AbstractEngine;
	private readonly scene: Scene;
	private readonly controller: SceneController;
	private readonly bus: EventBus<Events>;
	private readonly subscriptions: (() => void)[] = [];
	private readonly observers: Observer<KeyboardInfo>[] = [];
	private token: InspectorToken | undefined;

	constructor(props: ViewportManagerProps) {
		const { canvas, engine, bus } = props;
		this.canvas = canvas;
		this.engine = engine;
		this.bus = bus;
		this.scene = new Scene(this.engine);

		if (PUBLIC_ATTACH_INSPECTOR === 'true') {
			const obs = this.scene.onKeyboardObservable.add((kbInfo) => {
				if (kbInfo.type !== KeyboardEventTypes.KEYDOWN) return;
				const e = kbInfo.event;
				if (e.ctrlKey && e.key.toLowerCase() === 'i') {
					if (this.token) {
						this.token?.dispose();
						this.token = undefined;
					} else {
						this.token = ShowInspector(this.scene);
					}
				}
			});
			this.observers.push(obs);
		}
		this.controller = new SceneController({ canvas: this.canvas, scene: this.scene });
		const unsub = this.bus.on('goto', (args) => this.controller.goTo(args));
		this.subscriptions.push(unsub);
	}

	resize = () => this.engine.resize();
	run = () => {
		this.controller.onEnter();
		this.engine.runRenderLoop(() => {
			if (!this.controller) return;
			const dt = this.engine.getDeltaTime() / 1_000;
			this.controller.onUpdate(dt);
			this.scene.render();
		});
	};
	dispose = () => {
		this.subscriptions.forEach((unsub) => unsub());
		this.observers.forEach((obs) => obs.remove());
		this.token?.dispose();
		this.token = undefined;
		this.controller.onExit();
		this.scene.dispose();
		this.engine.dispose();
	};
}
