import {
	AbstractMesh,
	Material,
	MeshBuilder,
	SolidParticle,
	SolidParticleSystem,
	SolidParticleVertex,
	Vector3,
	type Scene
} from '@babylonjs/core';

export type ParticleManagerProps = {
	id: string;
	scene: Scene;
	material: Material;
	target: AbstractMesh;
};

type ParticleMeta = {
	velocity: Vector3;
	laneOrigin: Vector3;
	spinSpeed: number;
};

export class ParticleManager {
	private readonly scene: Scene;
	private readonly id: string;
	private readonly system: SolidParticleSystem;
	private readonly metadata: ParticleMeta[] = [];

	constructor(props: ParticleManagerProps) {
		const { id, scene, material } = props;
		this.scene = scene;
		this.id = id;
		this.system = new SolidParticleSystem(id, scene, { updatable: false });
		const box = MeshBuilder.CreateBox(`${this.id}-mesh`, { width: 10, height: 10 }, scene);
		this.system.addShape(box, 1_000, {
			positionFunction: this.positionParticle,
			vertexFunction: this.vertexParticle
		});
		this.system.updateParticle = this.updateParticle;
		this.system.initParticles();
		this.system.setParticles();
		const mesh = this.system.buildMesh();
		mesh.material = material;
		box.dispose();
	}

	start = () => {
		this.system.start();
	};
	update = () => this.system.setParticles();
	stop = () => this.system.stop();
	dispose = () => this.system.dispose();

	private positionParticle = (particle: SolidParticle, i: number) => {};
	private vertexParticle = (particle: SolidParticle, vertex: SolidParticleVertex, i: number) => {};
	private updateParticle = (particle: SolidParticle): SolidParticle => {
		return particle;
	};
}
