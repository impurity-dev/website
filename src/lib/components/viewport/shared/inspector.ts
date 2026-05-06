import { KeyboardEventTypes, Scene } from '@babylonjs/core';
import { PUBLIC_ATTACH_INSPECTOR } from '$env/static/public';
import { ShowInspector, type InspectorToken } from '@babylonjs/inspector';
import { DisposableManager } from './disposable.js';

export type InspectorProps = {
	scene: Scene;
};

export class Inspector {
	private readonly scene: Scene;
	private readonly disposable: DisposableManager;
	private token: InspectorToken | undefined;

	constructor(props: InspectorProps) {
		const { scene } = props;
		this.disposable = new DisposableManager();
		this.scene = scene;
	}

	attach = () => {
		if (!this.isEnabled()) return;

		const obs = this.scene.onKeyboardObservable.add((kbInfo) => {
			if (kbInfo.type !== KeyboardEventTypes.KEYDOWN) return;
			const e = kbInfo.event;
			if (e.ctrlKey && e.key.toLowerCase() === 'i') {
				if (this.token) this.close();
				else this.open();
			}
		});
		this.disposable.addObserver(obs);
	};

	dispose = () => {
		this.disposable.dispose();
		this.close();
	};

	private close = () => {
		this.token?.dispose();
		this.token = undefined;
	};

	private open = () => {
		this.token = ShowInspector(this.scene);
	};

	private isEnabled = () => PUBLIC_ATTACH_INSPECTOR === 'true';
}
