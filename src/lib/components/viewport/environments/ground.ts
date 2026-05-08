import { Matrix, Mesh, MeshBuilder, ShaderMaterial, type Scene } from '@babylonjs/core';
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
				uniforms: ['worldViewProjection', 'time']
			}
		);
		this.base.material = this.shader;
		this.shader.backFaceCulling = true;
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
	};

	dispose = () => this.disposable.dispose();
}
