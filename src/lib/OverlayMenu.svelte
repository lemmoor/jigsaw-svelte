<script>
	import { slide } from 'svelte/transition';
	let isOpen = false;
	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<section
	on:click={toggleMenu}
	class="xs: absolute top-0 left-0 cursor-pointer rounded-br-lg bg-surface-900/50 py-1 px-4 text-lg transition-all duration-300"
>
	<span class="text-token">&bull;&bull;&bull;</span>
	{#if isOpen}
		<div class="mt-2 mb-4" transition:slide>
			<slot />
		</div>
	{/if}
</section>
