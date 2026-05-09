import { Matrix, Mesh, MeshBuilder, ShaderMaterial, Vector3, type Scene } from '@babylonjs/core';
import { DisposableManager } from '../shared/disposable';

export type EnvironmentManagerProps = {
	scene: Scene;
	size: number;
	spacing: number;
};

export class GroundManager {
	private readonly scene: Scene;
	private readonly disposable: DisposableManager;
	private readonly base: Mesh;
	private readonly spacing: number;
	private readonly size: number;
	private readonly shader: ShaderMaterial;
	private time: number = 0;

	constructor({ scene, size, spacing }: EnvironmentManagerProps) {
		this.scene = scene;
		this.spacing = spacing;
		this.size = size;
		this.disposable = new DisposableManager();
		this.base = MeshBuilder.CreateBox('voxel', { size: 1 }, this.scene);
		this.shader = new ShaderMaterial(
			'ocean',
			scene,
			{
				vertex: 'ocean',
				fragment: 'ocean'
			},
			{
				attributes: ['position', 'normal', 'world0', 'world1', 'world2', 'world3'],
				uniforms: [
					'worldViewProjection',
					'time',
					'view',
					'vFogInfos',
					'vFogColor',
					'glowDeep',
					'glowMid',
					'glowCrest'
				]
			}
		);
		this.shader.setVector3('glowDeep', new Vector3(0.03, 0.2, 0.6));
		this.shader.setVector3('glowMid', new Vector3(0.0, 0.7, 0.65));
		this.shader.setVector3('glowCrest', new Vector3(0.9, 0.6, 0.1));

		this.shader.backFaceCulling = true;
		this.shader.fogEnabled = true;
		this.base.material = this.shader;
		const matrices: number[] = [];
		for (let x = -this.size; x < this.size; x++) {
			for (let z = -this.size; z < this.size; z++) {
				const matrix = Matrix.Translation(x * this.spacing, 0, z * this.spacing);
				matrices.push(...matrix.asArray());
			}
		}
		const buffer = new Float32Array(matrices);
		this.base.thinInstanceSetBuffer('matrix', buffer, 16, false);
		this.disposable.add(this.base);
		this.disposable.add(this.shader);
	}

	update = (dt: number) => {
		this.time += dt;
		this.shader.setFloat('time', this.time);
		this.shader.setVector3(
			'vFogInfos',
			new Vector3(this.scene.fogMode, this.scene.fogDensity, 0.0)
		);
		this.shader.setColor3('vFogColor', this.scene.fogColor);
	};

	dispose = () => this.disposable.dispose();
}
