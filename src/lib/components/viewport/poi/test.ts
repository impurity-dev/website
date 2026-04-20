// main.ts (or inside onMount in Svelte)

import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 🌫 Fog (depth illusion)
scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
scene.fogDensity = 0.015;

// 🎥 Camera
const camera = new BABYLON.FreeCamera('cam', new BABYLON.Vector3(0, 0, 0), scene);
camera.fov = 0.8;

// 💡 Light
new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

//
// 🧠 PATH GENERATOR (zig/zag/dive)
//
function generatePath() {
	const points: BABYLON.Vector3[] = [];
	let pos = new BABYLON.Vector3(0, 0, 0);
	let dir = new BABYLON.Vector3(0, 0, 1);

	for (let i = 0; i < 30; i++) {
		const yaw = (Math.random() - 0.5) * 1.2;
		const pitch = (Math.random() - 0.5) * 0.8;

		const rot = BABYLON.Quaternion.FromEulerAngles(pitch, yaw, 0);
		dir = BABYLON.Vector3.TransformCoordinates(dir, BABYLON.Matrix.FromQuaternion(rot));

		pos = pos.add(dir.scale(10));
		points.push(pos.clone());
	}

	return BABYLON.Curve3.CreateCatmullRomSpline(points, 100);
}

//
// 🧱 THIN INSTANCE FIELD
//
const baseCube = BABYLON.MeshBuilder.CreateBox('cube', { size: 1 }, scene);
const cubeMatrices: BABYLON.Matrix[] = [];

function fillCubeField(center: BABYLON.Vector3) {
	cubeMatrices.length = 0;

	for (let i = 0; i < 1500; i++) {
		const scale = Math.random() * 2 + 0.3;

		const m = BABYLON.Matrix.Compose(
			new BABYLON.Vector3(scale, scale, scale),
			BABYLON.Quaternion.Identity(),
			center.add(
				new BABYLON.Vector3(
					(Math.random() - 0.5) * 80,
					(Math.random() - 0.5) * 50,
					Math.random() * 200
				)
			)
		);

		cubeMatrices.push(m);
	}

	baseCube.thinInstanceSetBuffer(
		'matrix',
		cubeMatrices.flatMap((m) => m.toArray()),
		16
	);
}

//
// 🌀 RING TUNNELS (thin instances too)
//
const ring = BABYLON.MeshBuilder.CreateTorus('ring', { diameter: 10, thickness: 0.2 }, scene);

const ringMatrices: BABYLON.Matrix[] = [];

function fillRings(path: BABYLON.Curve3) {
	ringMatrices.length = [];

	const pts = path.getPoints();

	for (let i = 0; i < pts.length; i += 5) {
		const p = pts[i];

		const m = BABYLON.Matrix.Compose(
			new BABYLON.Vector3(1, 1, 1),
			BABYLON.Quaternion.Identity(),
			p
		);

		ringMatrices.push(m);
	}

	ring.thinInstanceSetBuffer(
		'matrix',
		ringMatrices.flatMap((m) => m.toArray()),
		16
	);
}

//
// ✨ GPU PARTICLES (speed streaks)
//
const ps = new BABYLON.GPUParticleSystem('particles', { capacity: 10000 }, scene);

ps.particleTexture = new BABYLON.Texture(
	'https://playground.babylonjs.com/textures/flare.png',
	scene
);

ps.emitter = camera;

ps.direction1 = new BABYLON.Vector3(0, 0, 1);
ps.direction2 = new BABYLON.Vector3(0, 0, 1);

ps.minLifeTime = 0.2;
ps.maxLifeTime = 0.5;
ps.minSize = 0.05;
ps.maxSize = 0.2;

ps.start();

//
// 🎥 POST PROCESSING (wow factor)
//
const pipeline = new BABYLON.DefaultRenderingPipeline('default', true, scene, [camera]);

pipeline.bloomEnabled = true;
pipeline.bloomWeight = 0.8;

pipeline.chromaticAberrationEnabled = true;
pipeline.chromaticAberration.aberrationAmount = 20;

//
// 🚀 MAIN TRAVERSAL LOOP
//
let path = generatePath();
let points = path.getPoints();

fillCubeField(points[0]);
fillRings(path);

let t = 0;
const speed = 20;

scene.onBeforeRenderObservable.add(() => {
	const dt = scene.getEngine().getDeltaTime() / 1000;

	t += dt * speed;

	const idx = Math.floor(t) % (points.length - 2);

	const pos = points[idx];
	const next = points[idx + 1];

	camera.position.copyFrom(pos);
	camera.setTarget(next);

	// 🎢 camera banking
	camera.rotation.z = Math.sin(t * 0.1) * 0.2;

	// 🔥 FOV pulse
	camera.fov = 0.8 + Math.sin(t * 0.05) * 0.4;

	// ♻️ regenerate world when near end
	if (idx > points.length - 10) {
		path = generatePath();
		points = path.getPoints();

		fillCubeField(points[0]);
		fillRings(path);

		t = 0;
	}
});

//
// 🖥 RUN
//
engine.runRenderLoop(() => {
	scene.render();
});

window.addEventListener('resize', () => {
	engine.resize();
});
