<script>
	//@ts-nocheck
	import Jigsaw from './lib/Jigsaw.svelte';
	import Modal from './lib/Modal.svelte';
	import OverlayMenu from './lib/OverlayMenu.svelte';
	import { gameEnded, gameStarted, timer } from './lib/stores.js';
	import { getReadableTime } from './utils';
	import MainMenu from './lib/MainMenu.svelte';
	import PuzzleBgToggle from './lib/PuzzleBgToggle.svelte';

	let jigsawSrc = '';
	let JigsawImg;

	function resetGame() {
		$gameStarted = false;
		$gameEnded = false;
		jigsawSrc = '';
	}
</script>

{#if !$gameStarted}
	<div class="grid min-h-screen place-content-center">
		<MainMenu bind:jigsawSrc />
	</div>
{/if}

<!-- an image for the jigsaw canvas -->
<img src={jigsawSrc} bind:this={JigsawImg} class="hidden" alt="" aria-hidden="true" width="0" />

{#if $gameStarted}
	<Jigsaw img={JigsawImg} />

	<OverlayMenu>
		<img src={jigsawSrc} alt="solved jigsaw" class="max-h-[75vh] w-full xs:max-w-md" />
		<PuzzleBgToggle />
		<button on:click={resetGame} class="btn btn-base btn-filled-primary mt-4 w-full">
			New Game
		</button>
	</OverlayMenu>
{/if}

{#if $gameEnded}
	<Modal on:close={resetGame}>
		<p class="!text-xl">Puzzle solved!</p>
		<p class="text-sm font-semibold md:text-2xl">
			Your time: {getReadableTime(new Date() - $timer)}
		</p>
	</Modal>
{/if}
