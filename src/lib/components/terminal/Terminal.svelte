<script lang="ts">
	type Props = {
		username: string;
		appName: string;
	};
	type Line = {
		id: number;
		text: string;
	};

	let { username, appName }: Props = $props();
	let history = $state<Line[]>([]);
	let input = $state('');
	let id = 0;
	let bottom: HTMLDivElement;
	const command = () => {
		if (!input.trim()) return;
		history = [...history, { id: id++, text: input }];
		input = '';
		requestAnimationFrame(() => {
			bottom?.scrollIntoView({ block: 'end' });
		});
	};
</script>

<div class="flex h-screen flex-col">
	<!-- main content above -->
	<div class="flex-1 overflow-auto p-4">
		<div class="col flex-col">
			<h1>{appName}</h1>
			<h2>{username}</h2>
		</div>
	</div>

	<!-- terminal at bottom -->
	<div class="flex h-64 flex-col border-t border-green-500/20">
		<!-- scrollable output -->
		<div class="flex-1 space-y-1 overflow-y-auto scroll-smooth bg-hacker-panel p-2">
			{#each history as record (record.id)}
				<div>{record.text}</div>
			{/each}
			<div bind:this={bottom} class="h-0"></div>
		</div>

		<!-- input -->
		<div class="flex flex-row border-t border-green-500/20 p-2">
			<span class="my-auto pr-2">{username}:~</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				bind:value={input}
				autofocus
				onkeydown={(e) => e.key === 'Enter' && command()}
				class="w-full bg-transparent outline-none"
				spellcheck="false"
			/>
		</div>
	</div>
</div>
