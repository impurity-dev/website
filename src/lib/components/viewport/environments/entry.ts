// EnvironmentManager.ts
import {
	Scene,
	HemisphericLight,
	PointLight,
	Vector3,
	Color3,
	MeshBuilder,
	StandardMaterial,
	PointsCloudSystem,
	Mesh
} from '@babylonjs/core';

export type EnvironmentMode = 'core' | 'projects' | 'skills' | 'experience';

export class EnvironmentManager {
	private scene: Scene;

	private coreMesh: Mesh | undefined;
	private voidSphere: Mesh | undefined;
	private particleMesh: Mesh | undefined;

	private pointLight: PointLight | undefined;

	public mode: EnvironmentMode = 'core';

	constructor(scene: Scene) {
		this.scene = scene;
	}

	async init() {
		this.createLighting();
		this.createVoid();
		this.createCore();
		await this.createParticles();
	}

	private createLighting() {
		new HemisphericLight('hemi', new Vector3(0, 1, 0), this.scene);

		this.pointLight = new PointLight('point', new Vector3(0, 2, 0), this.scene);

		this.pointLight.intensity = 15;
	}

	private createVoid() {
		this.voidSphere = MeshBuilder.CreateSphere('void', { diameter: 100 }, this.scene);

		const mat = new StandardMaterial('voidMat', this.scene);
		mat.backFaceCulling = false;
		mat.emissiveColor = new Color3(0.02, 0.02, 0.05);

		this.voidSphere.material = mat;
	}

	private createCore() {
		this.coreMesh = MeshBuilder.CreateBox('core', { size: 2 }, this.scene);

		this.coreMesh.position.y = 1;

		const mat = new StandardMaterial('coreMat', this.scene);
		mat.emissiveColor = new Color3(0.1, 0.6, 1.0);

		this.coreMesh.material = mat;
	}

	private async createParticles() {
		const pcs = new PointsCloudSystem('pcs', 1, this.scene);

		pcs.addPoints(2000, () => {
			return new Vector3(
				(Math.random() - 0.5) * 50,
				Math.random() * 10,
				(Math.random() - 0.5) * 50
			);
		});

		this.particleMesh = await pcs.buildMeshAsync();
	}

	// 🔥 KEY: future transitions plug into here
	setMode(mode: EnvironmentMode) {
		this.mode = mode;
	}

	update(dt: number) {
		// core idle animation
		if (this.coreMesh) {
			this.coreMesh.rotation.y += dt * 0.5;
			this.coreMesh.position.y = 1 + Math.sin(performance.now() * 0.001) * 0.1;
		}

		// subtle differences per mode (expand later)
		if (this.pointLight) {
			switch (this.mode) {
				case 'projects':
					this.pointLight.diffuse = new Color3(0.8, 0.2, 1.0);
					break;
				case 'skills':
					this.pointLight.diffuse = new Color3(0.2, 1.0, 0.8);
					break;
				case 'experience':
					this.pointLight.diffuse = new Color3(1.0, 0.6, 0.2);
					break;
				default:
					this.pointLight.diffuse = new Color3(0.3, 0.6, 1.0);
			}
		}
	}
}
