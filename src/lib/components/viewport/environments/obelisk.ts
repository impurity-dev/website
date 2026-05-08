import { Matrix, Mesh, MeshBuilder, Scene, Vector3, Engine } from '@babylonjs/core';

export class VoxelObelisk {
	private mesh: Mesh;

	private matrices: Float32Array;
	private basePositions: Vector3[] = [];

	private count = 0;

	// shape controls
	public height = 40;
	public radius = 6;

	public twist = 4.0;
	public taper = 0.8;

	private time = 0;

	constructor(scene: Scene) {
		this.mesh = MeshBuilder.CreateBox('voxel', { size: 0.45 }, scene);

		const layers = 80;
		const perLayer = 24;

		for (let y = 0; y < layers; y++) {
			const t = y / layers;

			for (let i = 0; i < perLayer; i++) {
				const a = (i / perLayer) * Math.PI * 2;

				const x = Math.cos(a) * this.radius;

				const z = Math.sin(a) * this.radius;

				this.basePositions.push(new Vector3(x, t * this.height, z));

				this.count++;
			}
		}

		this.matrices = new Float32Array(this.count * 16);

		this.mesh.thinInstanceSetBuffer('matrix', this.matrices, 16, true);
	}

	public update(dt: number) {
		this.time += dt;

		const matrix = new Matrix();

		for (let i = 0; i < this.count; i++) {
			const p = this.basePositions[i];

			const t = p.y / this.height;

			// =====================
			// TWIST
			// =====================

			const angle = t * this.twist * Math.PI * 2 + this.time * 0.5;

			// =====================
			// TAPER
			// =====================

			const taper = 1.0 - t * this.taper;

			// =====================
			// ORGANIC MOTION
			// =====================

			const noise = Math.sin(p.y * 0.25 + this.time * 1.5 + i * 0.05) * 0.6;

			const r = this.radius * taper + noise;

			const x = Math.cos(angle) * r;

			const z = Math.sin(angle) * r;

			// =====================
			// FLOWING BEND
			// =====================

			const bendX = Math.sin(t * 4 + this.time) * 2.0;

			const bendZ = Math.cos(t * 3 + this.time * 0.7) * 2.0;

			Matrix.TranslationToRef(x + bendX, p.y, z + bendZ, matrix);

			matrix.copyToArray(this.matrices, i * 16);
		}

		this.mesh.thinInstanceBufferUpdated('matrix');
	}
}
