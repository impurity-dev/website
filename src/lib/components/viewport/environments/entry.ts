import {
	Color3,
	Color4,
	DirectionalLight,
	HemisphericLight,
	MeshBuilder,
	Scene,
	Vector3
} from '@babylonjs/core';
import type { CameraController } from '../cameras/controller';
import { GroundManager } from './ground';
import { CoreManager } from './core';
import { SkyMaterial } from '@babylonjs/materials/sky';

export type EnvironmentManagerProps = {
	scene: Scene;
	camera: CameraController;
};

export class EnvironmentManager {
	private readonly scene: Scene;
	private readonly cameraController: CameraController;
	private readonly groundManager: GroundManager;
	private readonly coreManager: CoreManager;

	constructor(props: EnvironmentManagerProps) {
		const { scene, camera } = props;
		this.scene = scene;
		this.scene.clearColor = new Color4(0, 0, 0, 0);
		this.scene.fogMode = Scene.FOGMODE_EXP2;
		this.scene.fogDensity = 0.05;
		this.scene.fogColor = new Color3(0.01, 0.02, 0.05);
		this.cameraController = camera;
		this.groundManager = new GroundManager({ scene, size: 40, spacing: 1.2 });
		// this.coreManager = new CoreManager({ scene, id: 'core', position: new Vector3(10, 10, 0) });
		this.createSky(scene);
	}

	async init(): Promise<void> {
		this.createLights();
	}

	update(dt: number) {
		this.groundManager.update(dt);
		// this.coreManager.update(dt);
	}

	private createLights = () => {
		const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), this.scene);
		hemi.intensity = 0.6;
		hemi.groundColor = new Color3(0.05, 0.2, 0.05);
		const dir = new DirectionalLight('dir', new Vector3(-0.3, -1, 0.2), this.scene);
		dir.intensity = 0.8;
	};

	private createSky(scene: Scene) {
		const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene);

		const skyMaterial = new SkyMaterial('skyMaterial', scene);
		skyMaterial.backFaceCulling = false;

		// IMPORTANT: this is the main control now
		skyMaterial.useSunPosition = true;
		skyMaterial.sunPosition = new Vector3(0, 100, 0);

		// tuning that still exists
		skyMaterial.turbidity = 8;
		skyMaterial.luminance = 1;

		skybox.material = skyMaterial;
		skybox.infiniteDistance = true;

		return skyMaterial;
	}
}
