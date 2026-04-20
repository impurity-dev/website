

export type PoiGraphProps = { pois: Poi[]; initial: Poi };
export class PoiGraph {
	private current: Poi;
	private pois: Poi[];
	constructor(props: PoiGraphProps) {
		const { pois, initial } = props;
		this.current = initial;
		this.pois = pois;
	}

	getCurrent = () => this.current;
	getPois = () => this.pois;
}
