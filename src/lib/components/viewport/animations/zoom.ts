import type { Galaxy } from '../entities/galaxy';
import type { Animation, AnimationContext } from './animation';

export class ZoomAnimation implements Animation {
	name = 'galaxyZoom';

	private t = 0;
	private velocity = 0;
	private maxVelocity = 120;

	constructor(private field: Galaxy) {}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	start(ctx: AnimationContext) {
		this.t = 0;
		this.velocity = 0;
	}

	update(ctx: AnimationContext) {
		this.t += ctx.deltaTime;

		// aggressive acceleration
		const accel = 1 - Math.exp(-3 * this.t);
		this.velocity = this.maxVelocity * accel;

		// forward motion
		ctx.camera.position.z -= this.velocity * ctx.deltaTime;

		// slight drift (IMPORTANT)
		ctx.camera.position.x += Math.sin(this.t * 2) * 0.2;
		ctx.camera.position.y += Math.cos(this.t * 1.5) * 0.2;

		// update galaxies
		this.field.update(ctx.camera, this.velocity * ctx.deltaTime);
	}

	stop() {}

	isFinished() {
		return false; // keep running until interrupted
	}
}
