import type { Scene } from '@babylonjs/core';
import { DisposableManager } from '../shared/disposable';

export type ControllerProps = {
	scene: Scene;
	canvas: HTMLCanvasElement;
};
export abstract class Controller {
	protected readonly scene: Scene;
	protected readonly canvas: HTMLCanvasElement;
	protected readonly disposable: DisposableManager;
	constructor(props: ControllerProps) {
		const { scene, canvas } = props;
		this.scene = scene;
		this.canvas = canvas;
		this.disposable = new DisposableManager();
	}
	abstract onEnter(): Promise<void>;
	abstract onUpdate(delta: number): void;
	onExit = async (): Promise<void> => this.disposable.dispose();
}
