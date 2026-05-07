import { Scene, ShaderMaterial } from '@babylonjs/core';

export const createGrid = (props: { scene: Scene; id: string }) =>
	new ShaderMaterial(
		props.id,
		props.scene,
		{
			vertex: 'grid',
			fragment: 'grid'
		},
		{
			attributes: ['position', 'world0', 'world1', 'world2', 'world3'],
			uniforms: ['worldViewProjection', 'time']
		}
	);
