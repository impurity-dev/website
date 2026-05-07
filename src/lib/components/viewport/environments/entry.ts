import {
	Color3,
	Color4,
	DirectionalLight,
	HemisphericLight,
	MeshBuilder,
	Scene,
	StandardMaterial,
	Vector3
} from '@babylonjs/core';
import type { CameraController } from '../cameras/controller';
import { GroundManager } from './ground';
import { CoreManager } from './core';

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
		this.coreManager = new CoreManager({ scene, shardCount: 18, position: new Vector3(10, 10, 0) });
	}

	async init(): Promise<void> {
		this.createLights();
	}

	update(dt: number) {
		this.groundManager.update(dt);
		this.coreManager.update(dt);
	}

	private createLights = () => {
		const hemi = new HemisphericLight('hemi', new Vector3(0, 1, 0), this.scene);
		hemi.intensity = 0.6;
		hemi.groundColor = new Color3(0.05, 0.2, 0.05);
		const dir = new DirectionalLight('dir', new Vector3(-0.3, -1, 0.2), this.scene);
		dir.intensity = 0.8;
	};

	private createCore = () => {
		const core = MeshBuilder.CreateSphere('core', { diameter: 3 }, this.scene);
		core.position.y = 11;
		core.position.x = 10;

		const mat = new StandardMaterial('coreMat', this.scene);
		mat.emissiveColor = new Color3(0.2, 1, 0.7);

		core.material = mat;
	};

	private createHolograms() {
		for (let i = 0; i < 40; i++) {
			const box = MeshBuilder.CreateBox(
				'holo',
				{ size: 1, height: Math.random() * 10 + 4 },
				this.scene
			);

			box.position.x = (Math.random() - 0.5) * 80;
			box.position.z = (Math.random() - 0.5) * 80;
			box.position.y = box.scaling.y / 2;
		}
	}
}
