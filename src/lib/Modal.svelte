<script>
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');
</script>

<div
	class="fixed top-1/2 left-1/2 grid min-h-screen w-full -translate-x-1/2 -translate-y-1/2 grid-rows-[min-content_1fr]
		items-center gap-4 bg-surface-50 p-8 shadow-xl text-token dark:bg-surface-800 
		xs:min-h-[30rem] xs:max-w-[30rem] xs:rounded-lg"
	in:scale
	out:fade
>
	<!-- ✕ -->
	<span on:click={close} class="btn cursor-pointer justify-self-end p-0 text-2xl font-bold"
		>&#10005;</span
	>
	<div class="grid h-full grid-rows-[min-content_min-content_1fr] place-items-center gap-3">
		<slot />
	</div>
</div>
