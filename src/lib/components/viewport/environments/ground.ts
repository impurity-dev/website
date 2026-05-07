import { InstancedMesh, Mesh, MeshBuilder, type Scene } from '@babylonjs/core';
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

	private readonly cubes: InstancedMesh[] = [];
	private readonly offsets: Offset[] = [];
	private readonly base: Mesh;

	constructor(props: EnvironmentManagerProps) {
		const { scene, size, spacing } = props;
		this.scene = scene;
		this.disposable = new DisposableManager();

		this.base = MeshBuilder.CreateBox('voxel', { size: 1 }, this.scene);
		for (let x = -size; x < size; x++) {
			for (let z = -size; z < size; z++) {
				const inst = this.base.createInstance(`v_${x}_${z}`);
				inst.position.x = x * spacing;
				inst.position.z = z * spacing;
				inst.position.y = 0;

				this.cubes.push(inst);

				this.offsets.push({ x, z, phase: Math.random() * Math.PI * 2 });
			}
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update = (dt: number) => {
		const t = performance.now() * 0.001;
		for (let i = 0; i < this.cubes.length; i++) {
			const c = this.cubes[i];
			const o = this.offsets[i];
			// ===== traveling sine wave =====
			const wave = Math.sin(o.x * 0.2 + t) + Math.cos(o.z * 0.2 + t * 1.2);
			// ===== per-voxel randomness =====
			const noise = Math.sin(o.phase + t * 2.0) * 0.5;
			// ===== final height =====
			const height = wave + noise;
			c.position.y = height * 0.8;
			// optional: scale instead of just moving
			c.scaling.y = 1 + height * 0.3;
		}
	};
}
