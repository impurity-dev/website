import {
	Scene,
	MeshBuilder,
	StandardMaterial,
	Color3,
	DynamicTexture,
	GlowLayer,
	Camera,
	Mesh
} from '@babylonjs/core';

export function createMatrixGrid(scene: Scene, camera: Camera): Mesh {
	const ground = MeshBuilder.CreateGround('matrix-grid', { width: 200, height: 200 }, scene);

	const size = 512;
	const dt = new DynamicTexture('grid-texture', size, scene, true);
	const ctx = dt.getContext();
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, size, size);
	const step = 32;
	ctx.strokeStyle = 'rgba(0, 255, 100, 0.35)';
	ctx.lineWidth = 1;
	for (let i = 0; i < size; i += step) {
		ctx.beginPath();
		ctx.moveTo(i, 0);
		ctx.lineTo(i, size);
		ctx.stroke();

		ctx.beginPath();
		ctx.moveTo(0, i);
		ctx.lineTo(size, i);
		ctx.stroke();
	}
	dt.update();

	const mat = new StandardMaterial('matrix-mat', scene);
	mat.diffuseColor = new Color3(0, 0, 0);
	mat.specularColor = new Color3(0, 0, 0);
	mat.emissiveTexture = dt;
	mat.emissiveColor = new Color3(0.1, 1.0, 0.2);
	mat.opacityTexture = dt;
	ground.material = mat;

	const glow = new GlowLayer('matrix-glow', scene);
	glow.intensity = 0.8;
	glow.addIncludedOnlyMesh(ground);

	scene.onBeforeRenderObservable.add(() => {
		// lock to camera (infinite illusion)
		// ground.position.x = camera.position.x;
		// ground.position.z = camera.position.z;

		// subtle motion = “data flow”
		const t = performance.now() * 0.001;
		mat.emissiveColor.g = 0.7 + Math.sin(t * 2.0) * 0.3;
	});

	return ground;
}
