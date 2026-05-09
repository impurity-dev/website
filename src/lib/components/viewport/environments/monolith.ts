import { Matrix, Mesh, MeshBuilder, ShaderMaterial, Vector3, type Scene } from '@babylonjs/core';
import { DisposableManager } from '../shared/disposable';

export type MonolithManagerProps = {
	scene: Scene;
	size: number;
	spacing: number;
};

export class MonolithManager {
	private readonly scene: Scene;
	private readonly disposable: DisposableManager;
	private readonly base: Mesh;
	private readonly spacing: number;
	private readonly size: number;
	private readonly shader: ShaderMaterial;
	private time: number = 0;

	constructor({ scene, size, spacing }: MonolithManagerProps) {
		this.scene = scene;
		this.spacing = spacing;
		this.size = size;
		this.disposable = new DisposableManager();
		this.base = MeshBuilder.CreateBox('voxel', { size: 1 }, this.scene);
		this.shader = new ShaderMaterial(
			'monolith',
			scene,
			{
				vertex: 'monolith',
				fragment: 'monolith'
			},
			{
				attributes: ['position', 'normal', 'world0', 'world1', 'world2', 'world3'],
				uniforms: ['worldViewProjection', 'time', 'view', 'vFogInfos', 'vFogColor']
			}
		);
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
	};

	dispose = () => this.disposable.dispose();
}
