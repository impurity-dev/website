<script lang="ts">
	import { setUsername } from '../../../routes/actions';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let username = $state('');
	let password = $state('');
</script>

<div
	class="flex h-screen items-center justify-center"
	in:fade={{ duration: 400 }}
	out:fade={{ duration: 200 }}
>
	<div
		in:scale={{ duration: 300, easing: quintOut, start: 0.95 }}
		class="w-full max-w-md rounded-xl border border-green-500/20 bg-hacker-panel2 p-8 shadow-[0_0_40px_rgba(0,255,120,0.08)]"
	>
		<h2 class="mb-6 text-xl tracking-wide text-green-300">[ LOGIN ]</h2>

		<div class="space-y-5">
			<div>
				<label for="username" class="mb-1 block text-sm text-green-500/70"> username </label>
				<input
					id="username"
					bind:value={username}
					class="w-full rounded border border-green-500/20 bg-transparent px-3 py-2 transition outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
					placeholder="enter username"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm text-green-500/70"> password </label>
				<input
					id="password"
					bind:value={password}
					type="password"
					class="w-full rounded border border-green-500/20 bg-transparent px-3 py-2 transition outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
					placeholder="••••••••"
				/>
			</div>

			<button
				onclick={() => setUsername(username)}
				class="mt-4 w-full cursor-pointer rounded border border-green-400/40 py-2 text-green-300 transition hover:border-green-400 hover:bg-green-400/10"
			>
				enter
			</button>
		</div>
	</div>
</div>
