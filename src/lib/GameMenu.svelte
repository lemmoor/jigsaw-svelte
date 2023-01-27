<script>
	import { slide } from 'svelte/transition';
	let isOpen = false;
	function toggleMenu() {
		isOpen = !isOpen;
	}
</script>

<section on:click={toggleMenu}>
	<span>&bull;&bull;&bull;</span>
	{#if isOpen}
		<div class="menu-content" transition:slide>
			<slot />
		</div>
	{/if}
</section>

<style>
	section {
		position: absolute;
		top: 0;
		left: 0;
		background-color: #00000075;
		padding: 0.25rem 1rem;
		font-size: 1.5rem;
		color: white;
		cursor: pointer;
		border-radius: 0 0 10px 0;
		transition: all 3s ease;
	}

	.menu-content {
		padding: 2rem;
	}
</style>
