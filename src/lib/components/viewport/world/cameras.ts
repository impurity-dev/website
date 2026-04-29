import { FreeCamera, Vector3, type Scene } from '@babylonjs/core';

export type CameraProps = { scene: Scene; canvas: HTMLCanvasElement };
export const create = (props: CameraProps): FreeCamera => {
	const { canvas } = props;
	const camera = new FreeCamera('Camera', new Vector3(0, 10, 0));
	camera.attachControl(canvas, true);
	return camera;
};
