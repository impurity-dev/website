import { Curve3, Vector3 } from '@babylonjs/core';

export const createSpline = (from: Vector3, to: Vector3) => {
	const mid = Vector3.Lerp(from, to, 0.5);
	const control = mid.add(new Vector3(0, 5, 0));
	return Curve3.CreateQuadraticBezier(from, control, to, 60);
};
