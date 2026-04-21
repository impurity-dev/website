import { MeshBuilder, Vector3, type Camera, type Mesh, type Scene } from '@babylonjs/core';

export class Cluster {
	private nodes: Mesh[] = [];
	private center!: Vector3;
	private radius = 20;

	constructor(private scene: Scene) {}

	spawnRandom() {
		this.center = new Vector3(
			(Math.random() - 0.5) * 300,
			(Math.random() - 0.5) * 300,
			Math.random() * -500
		);

		const count = 20 + Math.random() * 40;

		for (let i = 0; i < count; i++) {
			const node = MeshBuilder.CreateSphere('node', { diameter: 0.8 }, this.scene);

			const offset = Vector3.Random().scale(this.radius);
			node.position = this.center.add(offset);

			this.nodes.push(node);
		}
	}

	update(camera: Camera, speed: number) {
		for (const n of this.nodes) {
			// move cluster toward camera
			n.position.z += speed;

			// slight swirl motion (THIS adds life)
			n.position.x += Math.sin(n.position.z * 0.01) * 0.05;
			n.position.y += Math.cos(n.position.z * 0.01) * 0.05;

			// recycle cluster
			if (n.position.z > camera.position.z + 10) {
				this.respawnBehind(camera);
				break;
			}
		}
	}

	private respawnBehind(camera: Camera) {
		this.center.z = camera.position.z - 500;

		for (const n of this.nodes) {
			const offset = Vector3.Random().scale(this.radius);
			n.position = this.center.add(offset);
		}
	}
}
