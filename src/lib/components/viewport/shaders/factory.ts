import { Color3, Scene, ShaderMaterial, Vector3 } from '@babylonjs/core';

export const createGrid = ({ scene, id }: { scene: Scene; id: string }) =>
	new ShaderMaterial(
		id,
		scene,
		{
			vertex: 'grid',
			fragment: 'grid'
		},
		{
			attributes: ['position', 'world0', 'world1', 'world2', 'world3'],
			uniforms: ['worldViewProjection', 'time']
		}
	);

export const createVoxelOceanShader = ({ scene, id }: { scene: Scene; id: string }) => {
	const shader = new ShaderMaterial(
		id,
		scene,
		{
			vertex: 'ocean',
			fragment: 'ocean'
		},
		{
			attributes: ['position', 'normal'],
			uniforms: [
				'worldViewProjection',
				'time',
				'waveStrength',
				'waveScale',
				'lightDirection',
				'cameraPosition',
				'waterColor',
				'deepColor'
			]
		}
	);

	shader.setFloat('waveStrength', 0.6);
	shader.setFloat('waveScale', 2.0);
	shader.setVector3('lightDirection', new Vector3(-0.4, -1, -0.2).normalize());
	shader.setColor3('waterColor', new Color3(0.1, 0.6, 0.55));
	shader.setColor3('deepColor', new Color3(0.0, 0.1, 0.2));

	return shader;
};
