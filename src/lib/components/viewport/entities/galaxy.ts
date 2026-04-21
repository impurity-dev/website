import { type Camera, type Scene } from '@babylonjs/core';
import { Cluster } from './cluster';

export class Galaxy {
	private clusters: Cluster[] = [];

	constructor(private scene: Scene) {}

	init(count = 20) {
		for (let i = 0; i < count; i++) {
			const cluster = new Cluster(this.scene);
			cluster.spawnRandom();
			this.clusters.push(cluster);
		}
	}

	update(camera: Camera, speed: number) {
		for (const cluster of this.clusters) {
			cluster.update(camera, speed);
		}
	}
}
