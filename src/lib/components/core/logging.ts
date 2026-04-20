const isDev = import.meta.env.DEV;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const log = (level: LogLevel, ...args: unknown[]) => {
	if (!isDev) return;
	const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
	fn(`[${level}]`, ...args);
};

export const logger = {
	debug: (...args: unknown[]) => log('debug', ...args),
	info: (...args: unknown[]) => log('info', ...args),
	warn: (...args: unknown[]) => log('warn', ...args),
	error: (...args: unknown[]) => log('error', ...args)
};
