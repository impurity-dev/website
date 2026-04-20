<script lang="ts">
	import type { EventBus, Events } from '../events/bus';
	import { TerminalManager, type Command, type Line, type Terminal } from './terminal';
	type Props = {
		username: string;
		appName: string;
		bus: EventBus<Events>;
	};
	let { username, appName }: Props = $props();
	let lines = $state<Line[]>([]);
	let input = $state('');

	let id = 0;
	const terminal: Terminal = {
		print: (text: string) => (lines = [...lines, { id: id++, text, type: 'stdout' }]),
		error: (text: string) => (lines = [...lines, { id: id++, text, type: 'stderr' }]),
		input: (text: string) => (lines = [...lines, { id: id++, text, type: 'input' }]),
		clear: () => (lines = [])
	};
	const commands: Record<string, Command> = {
		help: {
			desc: 'list cmds',
			parse: () => ({ ok: true, args: [] }),
			run: () => Object.entries(commands).forEach(([k, v]) => terminal.print(`${k} - ${v.desc}`))
		},
		clear: {
			desc: 'clear',
			parse: () => ({ ok: true, args: [] }),
			run: () => terminal.clear()
		},
		echo: {
			desc: 'echo text',
			parse: () => ({ ok: true, args: [] }),
			run: (a) => terminal.print(a.join(' '))
		},
		cd: {
			desc: 'navigate',
			parse: () => ({ ok: true, args: [] }),
			run: ([d]) => terminal.print(`go ${d}`)
		}
	};

	const terminalManager = new TerminalManager({ terminal, commands });

	let container: HTMLDivElement;
	let inputEl: HTMLInputElement;
	const command = () => {
		if (!input.trim()) return;
		terminalManager.exec(input);
		input = '';
		requestAnimationFrame(() => (container.scrollTop = container.scrollHeight));
	};

	const focusInput = () => inputEl?.focus();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex h-64 flex-col overflow-hidden border-t border-green-500/20 bg-black font-mono text-sm text-green-300"
	onclick={focusInput}
>
	<!-- OUTPUT (ONLY SCROLL AREA) -->
	<div bind:this={container} class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
		{#each lines as line (line.id)}
			<div class={line.type === 'stderr' ? 'text-red-400' : ''}>
				{line.type === 'input' ? '$ ' : ''}{line.text}
			</div>
		{/each}
	</div>

	<!-- INPUT LINE (terminal-style prompt, not a field) -->
	<div class="flex items-center border-t border-green-500/20 px-3 py-2">
		<span class="mr-2 whitespace-nowrap text-green-400">
			{username}@{appName}:~$
		</span>

		<!-- input area -->
		<div class="relative flex-1 font-mono leading-tight">
			<!-- text + cursor in same flow (IMPORTANT FIX) -->
			<div class="whitespace-pre text-green-200">
				{input}<span class="text-green-400">█</span>
			</div>

			<!-- hidden real input -->
			<input
				bind:this={inputEl}
				bind:value={input}
				onkeydown={(e) => e.key === 'Enter' && command()}
				class="absolute inset-0 opacity-0"
				autocomplete="off"
				spellcheck={false}
			/>
		</div>
	</div>
</div>
