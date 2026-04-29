// =====================================================
// cyber-world-builder.ts
// Converts cyberGraph -> BabylonJS abstract simulation
// =====================================================

import {
	Scene,
	TransformNode,
	Vector3,
	Mesh,
	MeshBuilder,
	StandardMaterial,
	Color3,
	GlowLayer,
	LinesMesh,
	Curve3
} from '@babylonjs/core';

import { cyberGraph, type SectorId, type SubnetId, type ExperienceNodeId } from './cyber-graph';

// =====================================================
// TYPES
// =====================================================

type SceneRuntimeNode = {
	id: string;
	type: 'sector' | 'subnet' | 'node';
	transform: TransformNode;
	mesh: Mesh;
};

export type CyberSceneGraph = {
	nodes: Record<string, SceneRuntimeNode>;
};

// =====================================================
// HELPERS
// =====================================================

function seeded(id: string): number {
	let h = 2166136261;
	for (let i = 0; i < id.length; i++) {
		h ^= id.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

function rand(seed: number): () => number {
	return () => {
		seed ^= seed << 13;
		seed ^= seed >> 17;
		seed ^= seed << 5;
		return (seed >>> 0) / 4294967296;
	};
}

function setPosition(node: TransformNode, x: number, y: number, z: number) {
	node.position = new Vector3(x, y, z);
}

function emissiveMaterial(scene: Scene, name: string, color: Color3, alpha = 1): StandardMaterial {
	const mat = new StandardMaterial(name, scene);
	mat.emissiveColor = color;
	mat.diffuseColor = color.scale(0.15);
	mat.specularColor = Color3.Black();
	mat.alpha = alpha;
	return mat;
}

// =====================================================
// ARCHETYPE VISUALS
// =====================================================

function createSectorMesh(scene: Scene, id: string, archetype: string, scale: number): Mesh {
	switch (archetype) {
		case 'archive-sector':
			return MeshBuilder.CreateTorus(
				`${id}-archive`,
				{ diameter: scale, thickness: scale * 0.04 },
				scene
			);

		case 'code-sector':
			return MeshBuilder.CreateTorusKnot(
				`${id}-code`,
				{
					radius: scale * 0.25,
					tube: scale * 0.03,
					radialSegments: 256
				},
				scene
			);

		case 'knowledge-sector':
			return MeshBuilder.CreatePolyhedron(`${id}-knowledge`, { size: scale * 0.2, type: 2 }, scene);

		case 'vault-sector':
			return MeshBuilder.CreateBox(`${id}-vault`, { size: scale * 0.3 }, scene);

		case 'chaos-sector':
		default:
			return MeshBuilder.CreateSphere(
				`${id}-chaos`,
				{ diameter: scale * 0.25, segments: 4 },
				scene
			);
	}
}

function createSubnetMesh(scene: Scene, id: string, layout: string, scale: number): Mesh {
	switch (layout) {
		case 'corridor':
			return MeshBuilder.CreateTube(
				`${id}-corridor`,
				{
					path: [new Vector3(-scale / 2, 0, 0), new Vector3(scale / 2, 0, 0)],
					radius: scale * 0.03
				},
				scene
			);

		case 'spiral':
			return MeshBuilder.CreateTorusKnot(
				`${id}-spiral`,
				{
					radius: scale * 0.12,
					tube: scale * 0.02
				},
				scene
			);

		case 'grid':
			return MeshBuilder.CreateGround(`${id}-grid`, { width: scale, height: scale }, scene);

		case 'vault':
			return MeshBuilder.CreateCylinder(
				`${id}-vault`,
				{ height: scale * 0.4, diameter: scale * 0.2 },
				scene
			);

		case 'chaos':
		default:
			return MeshBuilder.CreatePolyhedron(`${id}-chaos`, { size: scale * 0.15, type: 5 }, scene);
	}
}

function createExperienceMesh(
	scene: Scene,
	id: string,
	archetype: string,
	intensity: number
): Mesh {
	const scale = 12 + intensity * 16;

	switch (archetype) {
		case 'memory-monolith':
			return MeshBuilder.CreateBox(
				`${id}-monolith`,
				{ width: scale * 0.4, height: scale * 2, depth: scale * 0.4 },
				scene
			);

		case 'skill-crystal':
			return MeshBuilder.CreatePolyhedron(`${id}-crystal`, { size: scale, type: 1 }, scene);

		case 'project-engine':
			return MeshBuilder.CreateTorusKnot(
				`${id}-engine`,
				{ radius: scale * 0.5, tube: scale * 0.12 },
				scene
			);

		case 'data-core':
			return MeshBuilder.CreateSphere(`${id}-core`, { diameter: scale }, scene);

		case 'anomaly':
			return MeshBuilder.CreatePolyhedron(`${id}-anomaly`, { size: scale, type: 3 }, scene);

		case 'terminal-shard':
		default:
			return MeshBuilder.CreatePlane(
				`${id}-terminal`,
				{ width: scale, height: scale * 1.4 },
				scene
			);
	}
}

// =====================================================
// LINK VISUALIZATION
// =====================================================

function createLink(scene: Scene, from: Vector3, to: Vector3, id: string): LinesMesh {
	const mid = Vector3.Lerp(from, to, 0.5).add(new Vector3(0, 40, 0));
	const curve = Curve3.CreateQuadraticBezier(from, mid, to, 32);

	return MeshBuilder.CreateLines(`${id}-link`, { points: curve.getPoints() }, scene);
}

// =====================================================
// MAIN BUILDER
// =====================================================

export function buildCyberWorld(scene: Scene): CyberSceneGraph {
	const nodes: Record<string, SceneRuntimeNode> = {};

	new GlowLayer('cyber-glow', scene).intensity = 1.4;

	// -----------------------------------------
	// SECTORS
	// -----------------------------------------
	for (const [sectorId, sector] of Object.entries(cyberGraph.sectors) as [
		SectorId,
		(typeof cyberGraph.sectors)[SectorId]
	][]) {
		const root = new TransformNode(sectorId, scene);
		setPosition(root, sector.center.x, sector.center.y, sector.center.z);

		const mesh = createSectorMesh(scene, sectorId, sector.archetype, sector.scale);

		mesh.parent = root;
		mesh.material = emissiveMaterial(
			scene,
			`${sectorId}-mat`,
			new Color3(0.4, 0.2 + sector.distortion * 0.5, 1),
			0.55
		);

		nodes[sectorId] = {
			id: sectorId,
			type: 'sector',
			transform: root,
			mesh
		};
	}

	// -----------------------------------------
	// SUBNETS
	// -----------------------------------------
	for (const [subnetId, subnet] of Object.entries(cyberGraph.subnets) as [
		SubnetId,
		(typeof cyberGraph.subnets)[SubnetId]
	][]) {
		const sectorNode = nodes[subnet.sector];
		const root = new TransformNode(subnetId, scene);

		const r = rand(seeded(subnetId));
		setPosition(
			root,
			(r() - 0.5) * subnet.scale,
			(r() - 0.5) * subnet.scale * 0.4,
			(r() - 0.5) * subnet.scale
		);

		root.parent = sectorNode.transform;

		const mesh = createSubnetMesh(scene, subnetId, subnet.layout, subnet.scale);

		mesh.parent = root;
		mesh.material = emissiveMaterial(scene, `${subnetId}-mat`, new Color3(0.2, 0.9, 1), 0.7);

		nodes[subnetId] = {
			id: subnetId,
			type: 'subnet',
			transform: root,
			mesh
		};
	}

	// -----------------------------------------
	// EXPERIENCE NODES
	// -----------------------------------------
	for (const [nodeId, node] of Object.entries(cyberGraph.nodes) as [
		ExperienceNodeId,
		(typeof cyberGraph.nodes)[ExperienceNodeId]
	][]) {
		const subnetNode = nodes[node.subnet];
		const root = new TransformNode(nodeId, scene);
		const r = rand(seeded(nodeId));

		setPosition(root, (r() - 0.5) * 180, (r() - 0.5) * 120, (r() - 0.5) * 180);

		root.parent = subnetNode.transform;

		const mesh = createExperienceMesh(scene, nodeId, node.archetype, node.intensity);

		mesh.parent = root;
		mesh.material = emissiveMaterial(
			scene,
			`${nodeId}-mat`,
			new Color3(0.8, 1, 0.4 + node.intensity * 0.5),
			1
		);

		nodes[nodeId] = {
			id: nodeId,
			type: 'node',
			transform: root,
			mesh
		};
	}

	// -----------------------------------------
	// LINKS
	// -----------------------------------------
	for (const [nodeId, node] of Object.entries(cyberGraph.nodes) as [
		ExperienceNodeId,
		(typeof cyberGraph.nodes)[ExperienceNodeId]
	][]) {
		const from = nodes[nodeId];

		for (const targetId of node.links) {
			const to = nodes[targetId];
			if (!to) continue;

			createLink(
				scene,
				from.transform.getAbsolutePosition(),
				to.transform.getAbsolutePosition(),
				`${nodeId}-${targetId}`
			);
		}
	}

	return { nodes };
}
