type Disposable = { dispose(): void };

export class DisposableManager {
	private disposables: Disposable[] = [];
	addObserver = (obs: { remove: () => void }) => this.add({ dispose: () => obs.remove() });
	addSubscriber = (sub: () => void) => this.add({ dispose: () => sub() });
	add = (dis: Disposable) => this.disposables.push(dis);
	dispose = () => {
		this.disposables.forEach((dis) => dis.dispose());
		this.disposables = [];
	};
}
