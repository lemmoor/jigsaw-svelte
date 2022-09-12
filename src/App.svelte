<script>
  let jigsawSrc;
  
</script>

<main>
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
  <button on:click = {() => jigsawSrc = "https://picsum.photos/200/300"}>Solve random image</button>
  {#if (jigsawSrc)}
  <img src={jigsawSrc} alt="puzzle" width="400px">
  {/if}
</main>

<style>
</style>
