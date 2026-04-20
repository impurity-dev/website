export type Line = {
	id: number;
	type: 'input' | 'stdout' | 'stderr';
	text: string;
};

export type Terminal = {
	print: (l: string) => void;
	error: (l: string) => void;
	input: (l: string) => void;
	clear: () => void;
};

export type Command = {
	desc: string;
	run: (args: string[]) => void;
	parse: (args: string[]) => { ok: true; args: string[] } | { ok: false; error: string };
};

export type TerminalManagerProps = {
	terminal: Terminal;
	commands: Record<string, Command>;
};

export class TerminalManager {
	private readonly terminal: Terminal;
	private readonly commands: Record<string, Command>;

	constructor(props: TerminalManagerProps) {
		const { terminal, commands } = props;
		this.terminal = terminal;
		this.commands = commands;
	}

	exec = async (input: string) => {
		const [name, ...args] = input.trim().split(/\s+/);
		const command = this.commands[name as keyof typeof this.commands];
		if (!command) {
			this.terminal.error(`${name}: command not found`);
			return;
		}
		const parsed = command.parse(args);
		if (!parsed.ok) {
			this.terminal.error(parsed.error);
			return;
		}
		command.run(args);
	};
}
