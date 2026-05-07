import {
	Color3,
	GlowLayer,
	Mesh,
	MeshBuilder,
	StandardMaterial,
	TransformNode,
	Vector3,
	type Scene
} from '@babylonjs/core';
import { DisposableManager } from '../shared/disposable';

export type CoreManagerProps = {
	scene: Scene;
	shardCount: number;
	position: Vector3;
};
type Shard = {
	mesh: Mesh;
	angle: number;
	radius: number;
	speed: number;
	heightOffset: number;
};
export class CoreManager {
	private readonly scene: Scene;
	private readonly disposable: DisposableManager;

	private readonly root: TransformNode;
	private readonly core: Mesh;
	private readonly shards: Shard[] = [];
	private readonly shardCount: number;
	private readonly position: Vector3;

	constructor(props: CoreManagerProps) {
		const { scene, shardCount, position } = props;
		this.scene = scene;
		this.shardCount = shardCount;
		this.position = position;
		this.disposable = new DisposableManager();

		const glow = new GlowLayer('glow', scene);
		glow.intensity = 0.9;

		// ===== CORE =====
		this.core = MeshBuilder.CreateSphere('core', { segments: 64, diameter: 2 }, scene);

		const coreMat = new StandardMaterial('coreMat', scene);
		coreMat.emissiveColor = new Color3(0.1, 1.0, 0.4); // toxic green core
		coreMat.diffuseColor = new Color3(0, 0, 0);
		this.core.material = coreMat;

		// Floating anchor
		this.root = new TransformNode('coreRoot', scene);
		this.root.position = position;
		this.core.parent = this.root;

		// ===== ORBITING SHARDS =====

		for (let i = 0; i < this.shardCount; i++) {
			const shard = MeshBuilder.CreateBox('shard' + i, { size: 0.15 }, scene);

			const mat = new StandardMaterial('m' + i, scene);
			mat.emissiveColor = new Color3(0.0, 0.8, 0.3);
			mat.diffuseColor = new Color3(0, 0, 0);
			shard.material = mat;

			const angle = (i / this.shardCount) * Math.PI * 2;
			const radius = 2.5;

			this.shards.push({
				mesh: shard,
				angle,
				radius,
				speed: 0.5 + Math.random() * 0.8,
				heightOffset: (Math.random() - 0.5) * 2
			});
		}
	}

	update = (dt: number) => {
		const t = performance.now() * 0.001;
		// this.root.position.y = Math.sin(t * 1.2) * 0.03 + this.position.y;

		// // subtle rotation
		// this.core.rotation.y += dt * 0.5;
		// this.core.rotation.x += dt * 0.2;

		// // orbiting shards
		// for (const s of this.shards) {
		// 	s.angle += dt * s.speed;

		// 	const x = Math.cos(s.angle) * s.radius;
		// 	const z = Math.sin(s.angle) * s.radius;
		// 	const y = Math.sin(t * 2 + s.angle * 2) * 0.5 + s.heightOffset;

		// 	s.mesh.position.set(x + this.position.x, y + this.position.y, z);
		// 	s.mesh.rotation.x += dt * 2;
		// 	s.mesh.rotation.y += dt * 1.5;
		// }
	};
}
