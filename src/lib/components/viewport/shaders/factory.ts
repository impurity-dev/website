import { Scene, ShaderMaterial } from '@babylonjs/core';

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

export const createVoxelOceanShader = ({ scene, id }: { scene: Scene; id: string }) =>
	new ShaderMaterial(
		id,
		scene,
		{
			vertex: 'ocean',
			fragment: 'ocean'
		},
		{
			attributes: ['position', 'normal', 'world0', 'world1', 'world2', 'world3'],
			uniforms: ['worldViewProjection', 'time', 'cameraPosition']
		}
	);
