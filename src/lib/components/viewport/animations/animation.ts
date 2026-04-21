import type { Camera, Scene } from '@babylonjs/core';

export type AnimationContext = {
	scene: Scene;
	camera: Camera;
	deltaTime: number; // seconds since last frame
};

export interface Animation {
	name: string;

	start(ctx: AnimationContext): void;
	update(ctx: AnimationContext): void;
	stop(ctx: AnimationContext): void;

	isFinished?(): boolean;
}
