import type { Scene } from '@babylonjs/core';

export type WorldProps = { canvas: HTMLCanvasElement; scene: Scene };
export class World {
	constructor(props: WorldProps) {
		const { canvas, scene } = props;
	}
}
