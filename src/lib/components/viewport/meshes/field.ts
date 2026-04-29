import { Color3, MeshBuilder, StandardMaterial, VertexBuffer, type Scene } from '@babylonjs/core';

export const createField = (scene: Scene) => {
	const box = MeshBuilder.CreateBox('root', { size: 2 });
	box.alwaysSelectAsActiveMesh = true;

	const instanceCount = 1000;
	const colorData = new Float32Array(4 * instanceCount);

	for (let index = 0; index < instanceCount; index++) {
		colorData[index * 4] = Math.random();
		colorData[index * 4 + 1] = Math.random();
		colorData[index * 4 + 2] = Math.random();
		colorData[index * 4 + 3] = 1.0;
	}

	const buffer = new VertexBuffer(
		scene.getEngine(),
		colorData,
		VertexBuffer.ColorKind,
		false,
		false,
		4,
		true
	);
	box.setVerticesBuffer(buffer);

	const material = new StandardMaterial('material');
	material.disableLighting = true;
	material.emissiveColor = Color3.White();

	box.material = material;

	for (let index = 0; index < instanceCount - 1; index++) {
		const instance = box.createInstance('box' + index);
		instance.position.x = 20 - Math.random() * 40;
		instance.position.y = 20 - Math.random() * 40;
		instance.position.z = 20 - Math.random() * 40;
		instance.alwaysSelectAsActiveMesh = true;
	}
};
