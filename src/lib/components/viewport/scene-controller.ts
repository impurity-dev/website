import {
	ArcRotateCamera,
	Color3,
	Color4,
	GlowLayer,
	HemisphericLight,
	LinesMesh,
	MeshBuilder,
	Observer,
	Scene,
	StandardMaterial,
	Vector3
} from '@babylonjs/core';
import { logger } from '../core/logging';

export type SceneControllerProps = { canvas: HTMLCanvasElement; scene: Scene };
export class SceneController {
	private readonly canvas: HTMLCanvasElement;
	private readonly scene: Scene;
	private onBeforeRenderObservables: Observer<Scene>[] = [];

	constructor(props: SceneControllerProps) {
		const { canvas, scene } = props;
		this.canvas = canvas;
		this.scene = scene;
	}

	onEnter = () => {
		this.scene.fogMode = Scene.FOGMODE_EXP;
		this.scene.fogDensity = 0.015;
		this.scene.clearColor = new Color4(0, 0, 0, 1);
		const camera = new ArcRotateCamera(
			'camera',
			Math.PI / 2,
			Math.PI / 2.5,
			20,
			Vector3.Zero(),
			this.scene
		);
		const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
		light.intensity = 0.7;
		const glow = new GlowLayer('glow', this.scene);
		glow.intensity = 0.8;

		const mesh = MeshBuilder.CreateIcoSphere('glow-object', { radius: 6 }, this.scene);
		mesh.position.set(0, 5, 0);
		camera.target = mesh.position;
		const mat = new StandardMaterial('glow-mat', this.scene);
		mat.emissiveColor = new Color3(0, 1, 0);
		mat.diffuseColor = Color3.Black();
		mat.specularColor = Color3.Black();
		mat.wireframe = true;
		mesh.material = mat;
		this.onBeforeRender(() => {
			mesh.rotation.y += 0.01;
		});

		this.createInfiniteGrid();
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onUpdate = (delta: number) => {};

	goTo = (args: { from: string; to: string }) => {
		logger.info(args);
	};

	onExit = () => {
		this.onBeforeRenderObservables.forEach((obs) => {
			this.scene.onBeforeRenderObservable.remove(obs);
		});
	};

	private onBeforeRender = (cb: () => void) => {
		const obs = this.scene.onBeforeRenderObservable.add(cb);
		this.onBeforeRenderObservables.push(obs);
	};

	private createInfiniteGrid = () => {
		const gridSize = 100;
		const step = 2;

		const lines: LinesMesh[] = [];

		const mat = new StandardMaterial('gridMat', this.scene);
		mat.emissiveColor = new Color3(0, 1, 0).scale(0.25);
		mat.disableLighting = true;

		// 🔷 horizontal lines
		for (let i = -gridSize; i <= gridSize; i += step) {
			const line = MeshBuilder.CreateLines(
				`h-${i}`,
				{ points: [new Vector3(-gridSize, 0, i), new Vector3(gridSize, 0, i)] },
				this.scene
			);

			line.color = new Color3(0, 1, 0).scale(0.15);
			lines.push(line);
		}

		// 🔷 vertical lines
		for (let i = -gridSize; i <= gridSize; i += step) {
			const line = MeshBuilder.CreateLines(
				`v-${i}`,
				{ points: [new Vector3(i, 0, -gridSize), new Vector3(i, 0, gridSize)] },
				this.scene
			);

			line.color = new Color3(0, 1, 0).scale(0.15);
			lines.push(line);
		}

		// 🔁 infinite illusion: follow camera
		this.scene.onBeforeRenderObservable.add(() => {
			const camera = this.scene.activeCamera;
			if (!camera) return;

			const pos = camera.position;

			// snap grid to camera so it feels infinite
			const offsetX = Math.floor(pos.x / step) * step;
			const offsetZ = Math.floor(pos.z / step) * step;

			lines.forEach((l) => {
				l.position.x = offsetX;
				l.position.z = offsetZ;
			});
		});

		return lines;
	};
}
