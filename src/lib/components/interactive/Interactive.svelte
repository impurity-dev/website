<script lang="ts">
	let { viewport, terminal } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="flex-1 overflow-auto">
		{@render viewport?.()}
	</div>
	{@render terminal?.()}
</div>
