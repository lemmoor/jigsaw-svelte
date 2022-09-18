<script>
  import Jigsaw from './lib/Jigsaw.svelte'
  let jigsawSrc;
  let gameStart = false;
  let JigsawImg;

  function startGame () {
    if(jigsawSrc){
      gameStart = true;
      JigsawImg.style.display = "none";
    }
  }
</script>

<main class="container">
  <h1>Create your own jigsaw!</h1>
  <form>
    <label for="img">Select image:</label>
    <input type="file" id="img" name="img" accept="image/*">
    <input type="submit" on:click|preventDefault={(e) => {
      // @ts-ignore
      let file = e.target.form[0].files[0]
      if(file){
        jigsawSrc = URL.createObjectURL(file)
      }
      console.log(jigsawSrc)
    }}>
  </form>
  <button on:click = {() => jigsawSrc = "https://picsum.photos/500?random="+ Math.floor(Math.random() * 1000)}>Solve random image</button>
  {#if (jigsawSrc)}
    <img src={jigsawSrc} bind:this={JigsawImg} alt="puzzle" width="700px">
  {/if}
  <button on:click={startGame}>Start</button>
</main>
{#if (gameStart)}
<Jigsaw img={JigsawImg}/>
{/if}

<style>
 main {
  margin-bottom: 2rem;
 }
</style>
