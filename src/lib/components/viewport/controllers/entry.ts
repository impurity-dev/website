import { Color4 } from '@babylonjs/core';
import { logger } from '../../core/logging';
import { Controller } from './controller';
import { CameraController } from '../cameras/controller';
import { EnvironmentManager } from '../environments/entry';

export class EntryController extends Controller {
	private camera: CameraController | undefined;
	private environment: EnvironmentManager | undefined;

	onEnter = async () => {
		const { scene, canvas } = this;
		scene.clearColor = new Color4(0.01, 0.01, 0.02, 1);
		this.camera = new CameraController(scene);
		this.camera.attach(canvas);
		this.environment = new EnvironmentManager(scene);
		await this.environment.init();
	};

	onUpdate = (delta: number) => {
		this.camera?.update(delta);
		this.environment?.update(delta);
	};

	goTo = (args: { from: string; to: string }) => {
		logger.info(args);
	};

	onExit = async () => this.disposable.dispose();
}
