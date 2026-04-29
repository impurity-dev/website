import { Color4, HemisphericLight, Observer, Scene, Vector3 } from '@babylonjs/core';
import { logger } from '../core/logging';
import * as cameras from './world/cameras';
import * as thinInstances from './world/thin-instances';

export type SceneControllerProps = {
	canvas: HTMLCanvasElement;
	scene: Scene;
};
export class SceneController {
	private readonly canvas: HTMLCanvasElement;
	private readonly scene: Scene;
	private onBeforeRenderObservables: Observer<Scene>[] = [];
	private instances: thinInstances.InfiniteMatrixWorld | undefined;
	// private grid: InfiniteVoxelGrid | undefined;

	constructor(props: SceneControllerProps) {
		const { canvas, scene } = props;
		this.canvas = canvas;
		this.scene = scene;
	}

	onEnter = () => {
		const { scene, canvas } = this;
		scene.clearColor = new Color4(0, 0, 0, 0);
		const camera = cameras.create({ scene, canvas });
		camera.attachControl();
		new HemisphericLight('light', new Vector3(0, 1, 0), scene);
		// createField(scene);dw
		// this.grid = new InfiniteVoxelGrid(scene, camera, {
		// 	chunkSize: 2,
		// 	gridRadius: 40
		// });
		// this.grid.create();
		// const matManager = new MaterialManager();
		// const mat = matManager.createHologramMaterial(scene);
		// const cube = meshFactory.createVoxelStation(scene, mat);
		// camera.target = cube.position;

		// createMatrixGrid(scene, camera);
		// const particleManager = new ParticleManager({
		// 	id: 'particleManager',
		// 	scene,
		// 	material: createMatrixCubeMaterial(scene)
		// });
		// particleManager.start();
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onUpdate = (delta: number) => {
		this.instances?.update();
		// this.grid?.update();
	};

	goTo = (args: { from: string; to: string }) => {
		logger.info(args);
	};

	onExit = () => {
		this.onBeforeRenderObservables.forEach((obs) =>
			this.scene.onBeforeRenderObservable.remove(obs)
		);
	};

	// private onBeforeRender = (cb: () => void) => {
	// 	const obs = this.scene.onBeforeRenderObservable.add(cb);
	// 	this.onBeforeRenderObservables.push(obs);
	// };

	// private createInfiniteGrid = () => {
	// 	const gridSize = 100;
	// 	const step = 2;

	// 	const lines: LinesMesh[] = [];

	// 	const mat = new StandardMaterial('gridMat', this.scene);
	// 	mat.emissiveColor = new Color3(0, 1, 0).scale(0.25);
	// 	mat.disableLighting = true;

	// 	// 🔷 horizontal lines
	// 	for (let i = -gridSize; i <= gridSize; i += step) {
	// 		const line = MeshBuilder.CreateLines(
	// 			`h-${i}`,
	// 			{ points: [new Vector3(-gridSize, 0, i), new Vector3(gridSize, 0, i)] },
	// 			this.scene
	// 		);

	// 		line.color = new Color3(0, 1, 0).scale(0.15);
	// 		lines.push(line);
	// 	}

	// 	// 🔷 vertical lines
	// 	for (let i = -gridSize; i <= gridSize; i += step) {
	// 		const line = MeshBuilder.CreateLines(
	// 			`v-${i}`,
	// 			{ points: [new Vector3(i, 0, -gridSize), new Vector3(i, 0, gridSize)] },
	// 			this.scene
	// 		);

	// 		line.color = new Color3(0, 1, 0).scale(0.15);
	// 		lines.push(line);
	// 	}

	// 	// 🔁 infinite illusion: follow camera
	// 	this.scene.onBeforeRenderObservable.add(() => {
	// 		const camera = this.scene.activeCamera;
	// 		if (!camera) return;

	// 		const pos = camera.position;

	// 		// snap grid to camera so it feels infinite
	// 		const offsetX = Math.floor(pos.x / step) * step;
	// 		const offsetZ = Math.floor(pos.z / step) * step;

	// 		lines.forEach((l) => {
	// 			l.position.x = offsetX;
	// 			l.position.z = offsetZ;
	// 		});
	// 	});

	// 	return lines;
	// };
}
