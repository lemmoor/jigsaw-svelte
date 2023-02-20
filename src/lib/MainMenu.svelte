<script>
	import { fetchImage } from '../utils';
	import { num_rows, gameStarted, gameEnded, timer } from './stores';
	import { ArrowRightIcon, ArrowLeftIcon } from 'svelte-feather-icons';

	export let jigsawSrc;
	let imgInput;
	let imgLoading = false;
	let imgLoadingError = false;

	const options = ['Easy', 'Medium', 'Hard', 'debug'];
	let selected = options[0];

	$num_rows = 5;
	function setLevel() {
		if (selected === 'Easy') {
			$num_rows = 5;
		} else if (selected === 'Medium') {
			$num_rows = 7;
		} else if (selected === 'Hard') {
			$num_rows = 10;
		} else if (selected === 'debug') {
			$num_rows = 2;
		}
	}

	function startGame() {
		if (jigsawSrc) {
			$gameEnded = false;
			$gameStarted = true;
			$timer = new Date();
		}
	}

	let isNextPage = false;
	function movePage() {
		isNextPage = !isNextPage;
	}
</script>

<main
	class="mx-3 flex min-h-[30rem] w-[calc(100vw-1.5rem)] gap-8 overflow-hidden rounded-lg bg-surface-50 p-8 dark:bg-surface-800 xs:mx-auto xs:max-w-lg"
>
	<div
		class={`relative min-w-full pb-10 transition-transform xs:pb-0 ${
			isNextPage ? 'translate-x-[calc(-100%-10rem)]' : 'translate-x-0'
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
			class="mb-6 flex min-w-full flex-col flex-wrap items-center justify-center gap-3 sm:flex-row"
		>
			<button
				class="btn btn-base btn-filled-primary min-w-[12rem]"
				on:click|preventDefault={() => {
					imgInput.click();
				}}
			>
				Select image
			</button>
			<p>OR</p>
			<button
				class="btn btn-base btn-filled-primary min-w-[12rem]"
				on:click={async () => {
					imgLoading = true;
					imgLoadingError = false;
					jigsawSrc = null;

					try {
						jigsawSrc = (await fetchImage()).url;
					} catch (err) {
						imgLoadingError = true;
					}
					imgLoading = false;
				}}
			>
				Solve random image
			</button>
		</div>
		{#if jigsawSrc}
			<img src={jigsawSrc} alt="puzzle preview" class="mx-auto w-full max-w-xs" />
		{/if}
		{#if imgLoadingError}
			<p class="text-center">Couldn't find an image. Try again.</p>
		{/if}
		{#if imgLoading}
			<p class="text-center">Loading...</p>
		{/if}
		<button class="btn absolute bottom-0 right-0 p-0" on:click={movePage} disabled={!jigsawSrc}>
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
			<select bind:value={selected} on:change={setLevel} class="cursor-pointer p-1">
				{#each options as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
		{#if selected === 'Easy'}
			<p>Selected Easy ({$num_rows} x {$num_rows})</p>
		{:else if selected === 'Medium'}
			<p>Selected Medium ({$num_rows} x {$num_rows})</p>
		{:else if selected === 'Hard'}
			<p>Selected Hard ({$num_rows} x {$num_rows})</p>
		{/if}
		<button class="btn btn-base btn-filled-primary mt-8 w-full" on:click={startGame}>
			New Game
		</button>
		<button class="btn absolute bottom-0 left-0 p-0" on:click={movePage}>
			<ArrowLeftIcon size="34" class="cursor-pointer text-token" />
		</button>
	</div>
</main>
