<script>
	//@ts-nocheck
	import Jigsaw from './lib/Jigsaw.svelte';
	import Modal from './lib/Modal.svelte';
	import GameMenu from './lib/GameMenu.svelte';
	import { ArrowRightIcon, ArrowLeftIcon } from 'svelte-feather-icons';
	import { num_rows, bg_alpha, gameEnded, timer } from './lib/stores.js';
	import { getReadableTime, fetchImage } from './utils';

	let jigsawSrc;
	let JigsawImg;
	let imgInput;
	let gameStarted = false;

	const options = ['Easy', 'Medium', 'Hard', 'debug'];
	let selected = options[0];
	num_rows.update((n) => 5);
	let num_rows_value;
	num_rows.subscribe((value) => {
		num_rows_value = value;
	});
	bg_alpha.update((n) => 0.4);
	let bg_alpha_value;
	bg_alpha.subscribe((value) => {
		bg_alpha_value = value;
	});

	function resetGame() {
		gameStarted = false;
		$gameEnded = false;
		jigsawSrc = '';
	}

	function startGame() {
		if (jigsawSrc) {
			gameStarted = true;
			$timer = new Date();
		}
	}
	function setLevel() {
		if (selected === 'Easy') {
			num_rows.update((n) => 5);
		} else if (selected === 'Medium') {
			num_rows.update((n) => 7);
		} else if (selected === 'Hard') {
			num_rows.update((n) => 10);
		} else if (selected === 'debug') {
			num_rows.update((n) => 2);
		}
	}

	function toggleBackground() {
		if (bg_alpha_value > 0) {
			bg_alpha.update((n) => 0.0);
		} else {
			bg_alpha.update((n) => 0.4);
		}
	}

	let isNextPage = false;
	function movePage() {
		isNextPage = !isNextPage;
	}
</script>

{#if !gameStarted}
	<main
		class=" mx-auto flex min-h-[30rem] max-w-lg shrink-0 gap-8 overflow-hidden rounded-lg bg-surface-50 p-8 dark:bg-surface-800"
	>
		<!-- <h1 class="my-4 text-3xl font-bold">Create your own jigsaw!</h1> -->
		<div
			class={`relative min-w-full transition-transform ${
				isNextPage ? 'translate-x-[calc(-100%-2rem)]' : 'translate-x-0'
			}`}
		>
			<form class="">
				<input
					type="file"
					id="img"
					name="img"
					class="hidden"
					accept="image/*"
					bind:this={imgInput}
					on:change={(e) => {
						// @ts-ignore
						let file = e.target.form[0].files[0];
						if (file) {
							jigsawSrc = URL.createObjectURL(file);
						}
					}}
				/>
			</form>
			<div
				class="mb-6 flex w-full min-w-full flex-col flex-wrap items-center justify-center sm:flex-row"
			>
				<button
					class="btn btn-base btn-filled-primary min-w-[12rem]"
					on:click|preventDefault={() => {
						imgInput.click();
					}}
					>Select image
				</button>
				<p class="mx-3">OR</p>
				<button
					on:click={async () => ({ url: jigsawSrc } = await fetchImage())}
					class="btn btn-base btn-filled-primary min-w-[12rem]"
					>Solve random image
				</button>
			</div>
			{#if jigsawSrc}
				<img src={jigsawSrc} alt="puzzle preview" class=" mx-auto w-full max-w-xs" />
			{/if}
			<button class="btn absolute bottom-0 right-0 p-0" on:click={movePage}>
				<ArrowRightIcon size="34" class="cursor-pointer text-token" />
			</button>
		</div>

		<div
			class={`relative min-w-full transition-transform ${
				isNextPage ? 'translate-x-[calc(-100%-2rem)]' : 'translate-x-0'
			}`}
		>
			<label class="mb-2">
				<span>Select difficulty:</span>
				<select bind:value={selected} on:click={setLevel} class="cursor-pointer p-1">
					{#each options as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
			{#if selected === 'Easy'}
				<p>Selected Easy ({num_rows_value} x {num_rows_value})</p>
			{:else if selected === 'Medium'}
				<p>Selected Medium ({num_rows_value} x {num_rows_value})</p>
			{:else if selected === 'Hard'}
				<p>Selected Hard ({num_rows_value} x {num_rows_value})</p>
			{/if}
			<button
				class="btn btn-base btn-filled-primary mt-8 w-full"
				on:click={() => {
					if (gameStarted) resetGame();
					else startGame();
				}}
				>New Game
			</button>
			<button class="btn absolute bottom-0 left-0 p-0" on:click={movePage}>
				<ArrowLeftIcon size="34" class="cursor-pointer text-token" />
			</button>
		</div>
	</main>
{/if}

<!-- an image for the jigsaw canvas -->
<img src={jigsawSrc} bind:this={JigsawImg} class="hidden" alt="" aria-hidden="true" width="0" />

{#if gameStarted}
	<Jigsaw img={JigsawImg} />

	<GameMenu>
		<img src={jigsawSrc} alt="solved jigsaw" />
		<div class="flex cursor-pointer gap-2">
			<input on:click={toggleBackground} type="checkbox" checked id="switch" class="checkbox" />
			<label for="switch" class="toggle">
				<p>Background image</p>
			</label>
		</div>

		<button
			on:click={() => {
				if (gameStarted) resetGame();
				else startGame();
			}}>New Game</button
		>
	</GameMenu>
{/if}

{#if $gameEnded}
	<Modal on:close={resetGame}>
		<h2>Puzzle solved!</h2>
		<p class="text-sm font-bold md:text-2xl">Your time: {getReadableTime(new Date() - $timer)}</p>
	</Modal>
{/if}

<style>
	.modal-text {
		font-size: 1.5rem;
		margin-top: 2rem;
	}
</style>
