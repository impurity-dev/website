import { Vector3 } from '@babylonjs/core';

export type Poi = {
	position: Vector3;
	neighbors: string[];
};

export const getPoiGraph = (): Record<string, Poi> => ({
	home: {
		position: new Vector3(0, 0, 0),
		neighbors: ['career']
	},
	career: {
		position: new Vector3(0, 3, 0),
		neighbors: ['home']
	}
});
