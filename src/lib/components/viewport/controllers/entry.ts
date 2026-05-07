import { logger } from '../../core/logging';
import { Controller } from './controller';
import { CameraController } from '../cameras/controller';
import { EnvironmentManager } from '../environments/entry';

export class EntryController extends Controller {
	private camera: CameraController | undefined;
	private environment: EnvironmentManager | undefined;

	onEnter = async () => {
		const { scene, canvas } = this;
		this.camera = new CameraController(scene);
		this.camera.attach(canvas);
		this.environment = new EnvironmentManager({ scene, camera: this.camera });
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
