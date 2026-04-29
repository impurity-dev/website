import { Scene, Mesh, MeshBuilder, TransformNode, Vector3, Material } from '@babylonjs/core';

/**
 * Basic voxel cube
 */
export function createVoxelCube(scene: Scene, material?: Material, size = 1): Mesh {
	const mesh = MeshBuilder.CreateBox('voxel-cube', { size }, scene);

	if (material) mesh.material = material;

	return mesh;
}

/**
 * Voxel asteroid cluster
 * Jagged blocky rock made from multiple cubes
 */
export function createVoxelAsteroid(scene: Scene, material?: Material, size = 4): TransformNode {
	const root = new TransformNode('voxel-asteroid', scene);

	const count = 10 + Math.floor(Math.random() * 20);

	for (let i = 0; i < count; i++) {
		const cube = createVoxelCube(scene, material, 0.5 + Math.random() * 1.2);

		cube.parent = root;

		cube.position = new Vector3(
			(Math.random() - 0.5) * size,
			(Math.random() - 0.5) * size,
			(Math.random() - 0.5) * size
		);

		cube.rotation = new Vector3(
			(Math.random() * Math.PI) / 4,
			(Math.random() * Math.PI) / 4,
			(Math.random() * Math.PI) / 4
		);
	}

	return root;
}

/**
 * Voxel crystal shard
 * Tower-like block formation
 */
export function createVoxelCrystal(scene: Scene, material?: Material, height = 6): TransformNode {
	const root = new TransformNode('voxel-crystal', scene);

	for (let y = 0; y < height; y++) {
		const layerSize = Math.max(1, Math.floor((height - y) / 2));

		for (let x = -layerSize; x <= layerSize; x++) {
			for (let z = -layerSize; z <= layerSize; z++) {
				if (Math.random() > 0.7) continue;

				const cube = createVoxelCube(scene, material, 1);

				cube.parent = root;
				cube.position = new Vector3(x, y, z);
			}
		}
	}

	return root;
}

/**
 * Voxel portal gate
 * Square ring instead of torus
 */
export function createVoxelPortal(
	scene: Scene,
	material?: Material,
	width = 12,
	height = 12,
	thickness = 1
): TransformNode {
	const root = new TransformNode('voxel-portal', scene);

	for (let x = -width / 2; x <= width / 2; x++) {
		for (let t = 0; t < thickness; t++) {
			const top = createVoxelCube(scene, material);
			top.parent = root;
			top.position = new Vector3(x, height / 2, t);

			const bottom = createVoxelCube(scene, material);
			bottom.parent = root;
			bottom.position = new Vector3(x, -height / 2, t);
		}
	}

	for (let y = -height / 2; y <= height / 2; y++) {
		for (let t = 0; t < thickness; t++) {
			const left = createVoxelCube(scene, material);
			left.parent = root;
			left.position = new Vector3(-width / 2, y, t);

			const right = createVoxelCube(scene, material);
			right.parent = root;
			right.position = new Vector3(width / 2, y, t);
		}
	}

	return root;
}

/**
 * Voxel obelisk / monument
 */
export function createVoxelObelisk(scene: Scene, material?: Material, height = 10): TransformNode {
	const root = new TransformNode('voxel-obelisk', scene);

	for (let y = 0; y < height; y++) {
		const width = Math.max(1, Math.floor((height - y) / 3));

		for (let x = -width; x <= width; x++) {
			for (let z = -width; z <= width; z++) {
				const cube = createVoxelCube(scene, material);

				cube.parent = root;
				cube.position = new Vector3(x, y, z);
			}
		}
	}

	return root;
}

/**
 * Voxel satellite
 */
export function createVoxelSatellite(scene: Scene, material?: Material): TransformNode {
	const root = new TransformNode('voxel-satellite', scene);

	const core = createVoxelCube(scene, material, 2);
	core.parent = root;

	for (let i = -4; i <= 4; i++) {
		const panelLeft = createVoxelCube(scene, material, 0.8);
		panelLeft.parent = root;
		panelLeft.position = new Vector3(-3, 0, i);

		const panelRight = createVoxelCube(scene, material, 0.8);
		panelRight.parent = root;
		panelRight.position = new Vector3(3, 0, i);
	}

	return root;
}

/**
 * Voxel debris shard
 */
export function createVoxelDebris(scene: Scene, material?: Material, size = 3): TransformNode {
	const root = new TransformNode('voxel-debris', scene);

	const count = 4 + Math.floor(Math.random() * 8);

	for (let i = 0; i < count; i++) {
		const cube = createVoxelCube(scene, material, 0.4 + Math.random());

		cube.parent = root;

		cube.position = new Vector3(
			(Math.random() - 0.5) * size,
			(Math.random() - 0.5) * size,
			(Math.random() - 0.5) * size
		);
	}

	return root;
}

/**
 * Massive voxel space station
 */
export function createVoxelStation(scene: Scene, material?: Material): TransformNode {
	const root = new TransformNode('voxel-station', scene);

	// central body
	for (let x = -2; x <= 2; x++) {
		for (let y = -2; y <= 2; y++) {
			for (let z = -2; z <= 2; z++) {
				const cube = createVoxelCube(scene, material);
				cube.parent = root;
				cube.position = new Vector3(x, y, z);
			}
		}
	}

	// arms
	const armLength = 8;

	for (let i = 3; i <= armLength; i++) {
		['x', 'z'].forEach((axis) => {
			const cube1 = createVoxelCube(scene, material);
			cube1.parent = root;

			const cube2 = createVoxelCube(scene, material);
			cube2.parent = root;

			if (axis === 'x') {
				cube1.position = new Vector3(i, 0, 0);
				cube2.position = new Vector3(-i, 0, 0);
			} else {
				cube1.position = new Vector3(0, 0, i);
				cube2.position = new Vector3(0, 0, -i);
			}
		});
	}

	return root;
}
