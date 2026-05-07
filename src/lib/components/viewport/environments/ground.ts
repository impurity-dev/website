import { Matrix, Mesh, MeshBuilder, Quaternion, Vector3, type Scene } from '@babylonjs/core';
import { DisposableManager } from '../shared/disposable';

export type EnvironmentManagerProps = {
	scene: Scene;
	size: number;
	spacing: number;
};

type Offset = { x: number; z: number; phase: number };

export class GroundManager {
	private readonly scene: Scene;
	private readonly disposable: DisposableManager;

	private readonly offsets: Offset[] = [];
	private readonly base: Mesh;
	private readonly count: number;

	private readonly _scaleVec = new Vector3(1, 1, 1);
	private readonly _posVec = new Vector3(0, 0, 0);
	private readonly _quat = Quaternion.Identity();
	private readonly _matrix = Matrix.Identity();
	private readonly _spacing: number;
	private readonly _size: number;
	private _t = 0;

	constructor(props: EnvironmentManagerProps) {
		const { scene, size, spacing } = props;
		this.scene = scene;
		this._spacing = spacing;
		this._size = size;
		this.disposable = new DisposableManager();

		this.base = MeshBuilder.CreateBox('voxel', { size: 1 }, this.scene);
		const matrices: number[] = [];
		for (let x = -this._size; x < this._size; x++) {
			for (let z = -this._size; z < this._size; z++) {
				const matrix = Matrix.Translation(x * this._spacing, 0, z * this._spacing);
				matrices.push(...matrix.asArray());
				this.offsets.push({ x, z, phase: Math.random() * Math.PI * 2 });
			}
		}
		this.count = this.offsets.length;
		const buffer = new Float32Array(matrices);
		this.base.thinInstanceSetBuffer('matrix', buffer, 16, false);
		this.disposable.add(this.base);
	}

	update = (dt: number) => {
		this._t += dt;

		for (let i = 0; i < this.count; i++) {
			const o = this.offsets[i];

			const wave = Math.sin(o.x * 0.2 + this._t) + Math.cos(o.z * 0.2 + this._t * 1.2);
			const noise = Math.sin(o.phase + this._t * 2.0) * 0.5;
			const height = wave + noise;

			this._scaleVec.set(1, 1 + height * 0.3, 1);
			this._posVec.set(o.x * this._spacing, height * 0.8, o.z * this._spacing);

			Matrix.ComposeToRef(this._scaleVec, this._quat, this._posVec, this._matrix);

			this.base.thinInstanceSetMatrixAt(i, this._matrix, false);
		}

		this.base.thinInstanceBufferUpdated('matrix');
	};

	dispose = () => this.disposable.dispose();
}
