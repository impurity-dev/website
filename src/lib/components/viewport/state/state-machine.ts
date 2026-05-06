export interface State<Transition extends string, Context> {
	name: Transition;
	onEnter(ctx: Context): Promise<void>;
	onExit(ctx: Context): Promise<void>;
	transitions: Record<Transition, Context>;
}

export type StateMachineProps<Transition extends string, Context> = {
	initial: State<Transition, Context>;
	context: Context;
	states: State<Transition, Context>[];
};

export class StateMachine<Transition extends string, Context> {
	private readonly states: Map<Transition, State<Transition, Context>>;
	private current: State<Transition, Context>;

	constructor(props: StateMachineProps<Transition, Context>) {
		const { initial, context, states } = props;
		this.states = new Map(states.map((state) => [state.name, state]));
		this.current = initial;
		this.current.onEnter(context);
	}

	getState = () => this.current;

	goTo = async (trx: Transition, ctx: Context): Promise<void> => {
		const next = this.states.get(trx);
		if (!this.current.transitions[trx]) {
			throw new InvalidTransition(`Invalid transition: ${this.current.name} -> ${trx}`);
		} else if (!next) {
			throw new InvalidTransition(`Transition not registered: ${trx}`);
		}
		await this.current.onExit(ctx);
		this.current = next;
		await this.current.onEnter(ctx);
	};
}

export class InvalidTransition extends Error {}
