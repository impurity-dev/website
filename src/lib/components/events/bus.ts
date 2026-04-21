import { logger } from '$lib/components/core/logging';

export type Events = {
	goto: { from: string; to: string };
};

export type TypedListener<T, K extends keyof T> = (payload: T[K]) => void;

export class EventBus<T extends Record<string, unknown>> {
	private readonly listeners: {
		[K in keyof T]?: Set<TypedListener<T, K>>;
	} = {};

	on = <K extends keyof T>(event: K, handler: TypedListener<T, K>) => {
		if (!this.listeners[event]) {
			this.listeners[event] = new Set();
		}
		logger.info(`registering ${event.toString()} to handler ${handler.toString()}`);
		this.listeners[event].add(handler);
		return () => this.off(event, handler);
	};

	off = <K extends keyof T>(event: K, handler: TypedListener<T, K>) => {
		logger.info(`removing ${event.toString()} handler ${handler.toString()}`);
		this.listeners[event]?.delete(handler);
	};

	emit = <K extends keyof T>(event: K, payload: T[K]) => {
		logger.info(`emitting ${event.toString()} with payload ${JSON.stringify(payload)}`);
		this.listeners[event]?.forEach((handler) => handler(payload));
	};

	once = <K extends keyof T>(event: K, handler: TypedListener<T, K>) => {
		const wrapper = (payload: T[K]) => {
			handler(payload);
			this.off(event, wrapper);
		};
		logger.info(`emitting ${event.toString()} once to handler ${handler.toString()}`);
		this.on(event, wrapper);
	};
}
