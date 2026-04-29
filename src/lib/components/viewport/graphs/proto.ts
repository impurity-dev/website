import {
	Scene,
	Vector3,
	ArcRotateCamera,
	HemisphericLight,
	MeshBuilder,
	StandardMaterial,
	Color3,
	Animation,
	EasingFunction,
	CubicEase,
	TransformNode,
	Color4,
	AbstractMesh
} from '@babylonjs/core';

/* =====================================================
   1. SEMANTIC GRAPH (MEANING ONLY)
===================================================== */

type NodeId = string;

type Node = {
	id: NodeId;
	label: string;
	links: NodeId[];
};

const graph: Record<NodeId, Node> = {
	core: { id: 'core', label: 'Core System', links: ['ai', 'skills'] },
	ai: { id: 'ai', label: 'AI Cluster', links: ['core'] },
	skills: { id: 'skills', label: 'Skills Cluster', links: ['core'] }
};

/* =====================================================
   2. ENVIRONMENT FIELD (DENSITY / ATMOSPHERE)
===================================================== */

type Env = {
	fog: number;
	density: number;
};

const env: Env = {
	fog: 0.02,
	density: 1
};

/* =====================================================
   3. WORLD OBJECTS (DENSE MONOLITH FIELD)
===================================================== */

type WorldNode = {
	id: NodeId;
	mesh: AbstractMesh;
	position: Vector3;
};

const worldNodes: Record<NodeId, WorldNode> = {};

/* =====================================================
   4. BUILD CYBER WORLD (OBSCURED + ABSTRACT)
===================================================== */

function buildWorld(scene: Scene) {
	const root = new TransformNode('root', scene);

	for (const id in graph) {
		// const node = graph[id];

		// monolith (NOT the semantic node itself)
		const mesh = MeshBuilder.CreateBox(`m-${id}`, {
			size: 10 + Math.random() * 30
		});

		const mat = new StandardMaterial(`mat-${id}`, scene);
		mat.diffuseColor = new Color3(0.05, 0.05, 0.1);
		mat.emissiveColor = new Color3(0.1, 0.2, 0.4);
		mesh.material = mat;

		mesh.position = new Vector3(
			(Math.random() - 0.5) * 200,
			(Math.random() - 0.5) * 100,
			(Math.random() - 0.5) * 200
		);

		mesh.parent = root;

		worldNodes[id] = {
			id,
			mesh,
			position: mesh.position.clone()
		};
	}

	return root;
}

/* =====================================================
   5. TRAVERSAL ENGINE (ROLLERCOASTER SYSTEM)
===================================================== */

class TraversalEngine {
	scene: Scene;
	camera: ArcRotateCamera;

	constructor(scene: Scene, camera: ArcRotateCamera) {
		this.scene = scene;
		this.camera = camera;
	}

	goto(from: NodeId, to: NodeId) {
		const a = worldNodes[from].position;
		const b = worldNodes[to].position;

		// curve points (rollercoaster arc)
		const mid = a
			.add(b)
			.scale(0.5)
			.add(new Vector3(0, 50, 0));

		const path = [a, mid, b];

		const ease = new CubicEase();
		ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);

		const anim = new Animation('travel', 'position', 60, Animation.ANIMATIONTYPE_VECTOR3);

		anim.setKeys(
			path.map((p, i) => ({
				frame: i * 60,
				value: p
			}))
		);

		this.camera.animations = [];
		this.camera.animations.push(anim);

		this.scene.beginAnimation(this.camera, 0, 120, false);
	}
}

/* =====================================================
   6. SCENE BOOTSTRAP
===================================================== */

export function createScene(scene: Scene, canvas: HTMLCanvasElement) {
	// atmosphere (IMPORTANT FOR "DISTANCE FEEL")
	scene.clearColor = new Color4(0, 0, 0, 1);
	scene.fogMode = Scene.FOGMODE_EXP;
	scene.fogDensity = env.fog;

	const camera = new ArcRotateCamera('cam', Math.PI / 2, Math.PI / 2.5, 120, Vector3.Zero(), scene);

	camera.attachControl(canvas, true);

	new HemisphericLight('light', new Vector3(0, 1, 0), scene);

	// build dense world (NOT semantic nodes directly)
	buildWorld(scene);

	const traversal = new TraversalEngine(scene, camera);

	// demo travel loop
	setTimeout(() => traversal.goto('core', 'ai'), 1000);
	setTimeout(() => traversal.goto('ai', 'skills'), 4000);

	return scene;
}
