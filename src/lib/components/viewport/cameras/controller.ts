import { UniversalCamera, Vector3, Scene } from '@babylonjs/core';

export class CameraController {
	public readonly camera: UniversalCamera;
	private target = new Vector3(10, 10, 0);

	constructor(scene: Scene) {
		this.camera = new UniversalCamera('camera', new Vector3(0, 10, 0), scene);
		this.camera.setTarget(this.target);
		this.camera.speed = 0;
	}

	attach = (canvas: HTMLCanvasElement) => this.camera.attachControl(canvas, true);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(dt: number) {}

	setTarget(pos: Vector3) {
		this.target = pos;
		this.camera.setTarget(pos);
	}
}
