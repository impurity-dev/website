import { Effect } from '@babylonjs/core';

export type Shader = 'grid' | 'ocean';
export type ShaderEntry = { loaded: boolean };
export class ShaderManager {
	private readonly shaders: Shader[] = ['grid', 'ocean'];

	load = async () => await Promise.all(this.shaders.map(this.loadShader));

	private loadShader = async (name: Shader) => {
		const [vertex, fragment] = await Promise.all([
			fetch(`/shaders/${name}.vertex.fx`).then((r) => r.text()),
			fetch(`/shaders/${name}.fragment.fx`).then((r) => r.text())
		]);

		Effect.ShadersStore[`${name}VertexShader`] = vertex;
		Effect.ShadersStore[`${name}FragmentShader`] = fragment;
	};
}
