import { UniversalCamera, Vector3, Scene } from '@babylonjs/core';

export class CameraController {
	public readonly camera: UniversalCamera;
	private target = new Vector3(0, 1, 0);

	constructor(scene: Scene) {
		this.camera = new UniversalCamera('camera', new Vector3(0, 1.5, -8), scene);
		this.camera.setTarget(this.target);
		this.camera.speed = 0;
	}

	attach = (canvas: HTMLCanvasElement) => this.camera.attachControl(canvas, true);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(dt: number) {
		const t = performance.now() * 0.0005;
		this.camera.position.x = Math.sin(t) * 0.2;
	}

	setTarget(pos: Vector3) {
		this.target = pos;
		this.camera.setTarget(pos);
	}
}
