import {
	Scene,
	Camera,
	Mesh,
	MeshBuilder,
	Vector3,
	Matrix,
	StandardMaterial,
	Color3
} from '@babylonjs/core';

type Instance = {
	position: Vector3;
	matrix: Matrix;
};

export class InfiniteMatrixWorld {
	private mesh!: Mesh;

	private instances: Instance[] = [];
	private buffer!: Float32Array;

	private gridSize: number;
	private spacing: number;
	private depth: number;
	private speed: number;

	constructor(
		private scene: Scene,
		private camera: Camera,
		config?: {
			gridSize?: number;
			spacing?: number;
			depth?: number;
			speed?: number;
		}
	) {
		this.gridSize = config?.gridSize ?? 20;
		this.spacing = config?.spacing ?? 2;
		this.depth = config?.depth ?? 200;
		this.speed = config?.speed ?? 0.3;
	}

	// -----------------------------
	// CREATE WORLD
	// -----------------------------
	public create() {
		const base = MeshBuilder.CreateBox('matrix-cell', { size: 0.5 }, this.scene);

		const mat = new StandardMaterial('matrix-mat', this.scene);
		mat.emissiveColor = new Color3(0, 1, 0);
		mat.wireframe = true;

		base.material = mat;

		this.mesh = base;

		const total = this.gridSize * this.gridSize;
		this.buffer = new Float32Array(total * 16);

		for (let x = 0; x < this.gridSize; x++) {
			for (let z = 0; z < this.gridSize; z++) {
				const pos = new Vector3((x - this.gridSize / 2) * this.spacing, 0, z * this.spacing);

				this.instances.push({
					position: pos,
					matrix: Matrix.Translation(pos.x, pos.y, pos.z)
				});
			}
		}

		this.upload();
	}

	// -----------------------------
	// UPDATE (call per frame)
	// -----------------------------
	public update(deltaTime: number = 1) {
		const dz = this.speed * deltaTime;

		for (let i = 0; i < this.instances.length; i++) {
			const inst = this.instances[i];

			// move forward
			inst.position.z -= dz;

			// recycle
			if (inst.position.z < -10) {
				inst.position.z = this.depth;
				inst.position.x = (Math.random() - 0.5) * this.gridSize * this.spacing;
			}

			inst.matrix = Matrix.Translation(inst.position.x, inst.position.y, inst.position.z);

			inst.matrix.copyToArray(this.buffer, i * 16);
		}

		this.upload();
	}

	// -----------------------------
	// GPU BUFFER UPLOAD
	// -----------------------------
	private upload() {
		this.mesh.thinInstanceSetBuffer('matrix', this.buffer, 16);
	}
}
