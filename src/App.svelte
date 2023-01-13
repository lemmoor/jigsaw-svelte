<script>
  //@ts-nocheck
  import Jigsaw from './lib/Jigsaw.svelte'
  import Modal from './lib/Modal.svelte';
  import GameMenu from './lib/GameMenu.svelte';
  let jigsawSrc;
  let gameStarted = false;
  let JigsawImg;
  const options = ['Easy', 'Medium', 'Hard', 'debug'];
  let selected = options[0];
  import { num_rows, bg_alpha, gameEnded, timer } from './lib/stores.js';
  import { getReadableTime } from './utils';
  num_rows.update(n => 5);
  let num_rows_value;
  num_rows.subscribe(value => {
		num_rows_value = value;
	});
  bg_alpha.update(n => 0.4);
  let bg_alpha_value;
  bg_alpha.subscribe(value => {
		bg_alpha_value = value;
	});


  function resetGame() {
    gameStarted = false;
    $gameEnded = false;
    jigsawSrc = "";
    JigsawImg.style.display = "block";
  }

  function startGame () {
    if(jigsawSrc){
      gameStarted = true;
      JigsawImg.style.display = "none";
      $timer = new Date();
    }
  }
  function setLevel () {
    if (selected === 'Easy'){
      num_rows.update(n => 5);
    } else if (selected === 'Medium') {
      num_rows.update(n => 7);
    } else if (selected === 'Hard') {
      num_rows.update(n => 10);
    }
      else if (selected === 'debug') {
      num_rows.update(n => 2);
    }
  }
  function toggleBackground () {
    if(bg_alpha_value > 0) {
      bg_alpha.update(n => 0.0);
    } else {
      bg_alpha.update(n => 0.4);
    }
  }

  let imgInput;
</script>

<main class="container">
  {#if (!gameStarted)}
  <h1>Create your own jigsaw!</h1>
  <form class="form-1">
    <input type="file" id="img" name="img" accept="image/*" bind:this={imgInput} on:change={(e) => {
      // @ts-ignore
      let file = e.target.form[0].files[0]
      if(file){
        jigsawSrc = URL.createObjectURL(file)
      }
    }}>
  </form>
  <div class="choose-or-random-buttons">
    <button class="img-button" on:click|preventDefault={() => {imgInput.click()}}>Select image</button>
    <p>or</p>
    <button on:click = {() => jigsawSrc = "https://picsum.photos/500?random="+ Math.floor(Math.random() * 1000)}>Solve random image</button>
  </div>
  {/if}
  {#if (jigsawSrc)}
    <img src={jigsawSrc} bind:this={JigsawImg} alt="puzzle" width="700px">
  {/if}
  {#if !gameStarted}
  <select bind:value={selected} on:click={setLevel}>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>

  {#if selected === 'Easy'}
    <p>Selected Easy ({num_rows_value} x {num_rows_value})</p>
  {:else if selected === 'Medium'}
    <p>Selected Medium ({num_rows_value} x {num_rows_value})</p>
  {:else if selected === 'Hard'}
    <p>Selected Hard ({num_rows_value} x {num_rows_value})</p>
  {/if}

  <div class="background-image-checkbox-wrapper">
    <input on:click={toggleBackground} type="checkbox" checked id="switch" class="checkbox" />
    <label for="switch" class="toggle">
      <p>Background image</p>
    </label>
  </div>

  <button on:click={() => {if(gameStarted) resetGame(); else startGame()}}>New Game</button>
  {/if}
</main>

{#if (gameStarted)}
<Jigsaw img={JigsawImg}/>
<GameMenu>
  <img src={jigsawSrc} alt="solved jigsaw">
  <div class="background-image-checkbox-wrapper">
    <input on:click={toggleBackground} type="checkbox" checked id="switch" class="checkbox" />
    <label for="switch" class="toggle">
      <p>Background image</p>
    </label>
  </div>

  <button on:click={() => {if(gameStarted) resetGame(); else startGame()}}>New Game</button>
</GameMenu>
{/if}

{#if $gameEnded}
    <Modal on:close={resetGame}>
        <h2>Puzzle solved!</h2>
        <p class="modal-text">Your time: {getReadableTime(new Date() - $timer)}</p>
    </Modal>
{/if}

<style>
 /* main {
  margin-bottom: 2rem;
 } */

  .modal-text {
      font-size: 1.5rem;
      margin-top: 2rem;
  }

  img {
    width: 100%;
    max-width: 32rem;
  }
</style>