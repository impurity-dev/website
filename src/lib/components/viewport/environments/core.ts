import {
	Color3,
	GlowLayer,
	Matrix,
	Mesh,
	MeshBuilder,
	StandardMaterial,
	TransformNode,
	Vector3,
	Scene,
	Quaternion
} from '@babylonjs/core';

export class CoreManager {
	private root: TransformNode;
	private voxelMesh: Mesh;
	private matrices: Float32Array;
	private voxels: any[] = [];

	private time = 0;

	private tmpPos = new Vector3();
	private tmpScale = new Vector3();
	private tmpQuat = new Quaternion();

	constructor({ scene, position, id }: { scene: Scene; position: Vector3; id: string }) {
		this.root = new TransformNode(id, scene);
		this.root.position.copyFrom(position);

		// 🔥 glow is optional — don't rely on it for visibility
		new GlowLayer('glow', scene).intensity = 0.2;

		// =========================
		// VOXEL SOURCE
		// =========================

		this.voxelMesh = MeshBuilder.CreateBox(
			'voxel',
			{ size: 1 }, // 🔥 bigger = visible immediately
			scene
		);

		this.voxelMesh.parent = this.root;

		const mat = new StandardMaterial('m', scene);

		mat.emissiveColor = new Color3(0.08, 0.8, 0.25); // 🔥 MUCH stronger
		mat.diffuseColor = new Color3(0.01, 0.01, 0.01);
		mat.specularColor = Color3.Black();

		this.voxelMesh.material = mat;

		// =========================
		// BUILD VOXELS (ENSURE DENSITY)
		// =========================

		const radius = 2.2;
		const spacing = 0.28;

		for (let x = -radius; x <= radius; x += spacing) {
			for (let y = -radius; y <= radius; y += spacing) {
				for (let z = -radius; z <= radius; z += spacing) {
					const d = Math.sqrt(x * x + y * y + z * z);

					if (d > radius) continue;

					// 🔥 less aggressive culling (you were deleting visibility)
					if (Math.random() > 0.85) continue;

					this.voxels.push({
						base: new Vector3(x, y, z),
						scale: 0.9 + Math.random() * 0.3,
						offset: Math.random() * 100
					});
				}
			}
		}

		this.matrices = new Float32Array(this.voxels.length * 16);

		this.voxelMesh.thinInstanceSetBuffer('matrix', this.matrices, 16, true);

		// 🔥 CRITICAL: prevents invisible culling issues
		this.voxelMesh.refreshBoundingInfo(true);
	}

	update(dt: number) {
		this.time += dt;

		const m = new Matrix();

		for (let i = 0; i < this.voxels.length; i++) {
			const v = this.voxels[i];
			const p = v.base;

			const dist = p.length();

			// =====================
			// CORE SPIN FIELD
			// =====================

			const angle = this.time * 0.4 + dist * 0.8;

			const c = Math.cos(angle);
			const s = Math.sin(angle);

			const rx = p.x * c - p.z * s;
			const rz = p.x * s + p.z * c;

			// =====================
			// BREATHING
			// =====================

			const pulse = 1 + Math.sin(this.time * 2 + v.offset) * 0.1;

			// =====================
			// IMPORTANT FIX: keep structure centered
			// =====================

			this.tmpPos.set(rx * pulse, p.y * pulse, rz * pulse);

			// subtle float
			this.tmpPos.y += Math.sin(this.time + v.offset) * 0.05;

			// =====================
			// ROTATION
			// =====================

			Quaternion.FromEulerAnglesToRef(this.time * 0.2, this.time * 0.3 + v.offset, 0, this.tmpQuat);

			// =====================
			// SCALE
			// =====================

			const sc = v.scale * (1 + Math.sin(this.time + v.offset) * 0.05);
			this.tmpScale.set(sc, sc, sc);

			Matrix.ComposeToRef(this.tmpScale, this.tmpQuat, this.tmpPos, m);

			m.copyToArray(this.matrices, i * 16);
		}

		this.voxelMesh.thinInstanceBufferUpdated('matrix');
	}
}
