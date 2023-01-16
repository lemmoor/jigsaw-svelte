<script>
// @ts-nocheck
    import { Canvas, Layer, t} from "svelte-canvas";
    import audio from "/src/assets/puzzle.wav";
    import Puzzle from "./puzzle";
    export let img;
    import { num_rows, bg_alpha, gameEnded } from './stores.js';
    let num_rows_value;
    num_rows.subscribe(value => {
        num_rows_value = value;
    });
    let bg_alpha_value;
    bg_alpha.subscribe(value => {
        bg_alpha_value = value;
    });

    window.devicePixelRatio = 1;
    const rows = num_rows_value;
    const cols = num_rows_value;
    const scale = 0.7
    let canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const resize = scale * Math.min(canvasWidth/img.naturalWidth, canvasHeight/img.naturalHeight);
    const imgW = resize * img.naturalWidth;
    const imgH = resize * img.naturalHeight;
    let OffsetCenteredX = (canvasWidth)/2 - imgW/2; //x coords for a centered image
    let OffsetCenteredY = (canvasHeight)/2 - imgH/2; //y coords for a centered image
    let puzzlePieces = [];
    let movingPuzzleOffset;
    let movingPuzzle;
    let movingPuzzleIndex = null;
    let solvedPuzzles = 0;
    let cursorStyle = "default";

    function randomisePuzzles (p, maxX, maxY) {
        for(let i = 0; i < p.length; i++){
            p[i].currentPos.x = Math.floor(Math.random() * maxX) - OffsetCenteredX;
            p[i].currentPos.y = Math.floor(Math.random() * maxY);
        }
    }

    let canv;
    function handleMousedown (x, y, e=null) {
        let ctx = canv.getContext();
        for(let i = puzzlePieces.length - 1; i >=0; i--){
            if(ctx.isPointInPath(puzzlePieces[i].path, x, y)){
                movingPuzzle = puzzlePieces[i];
                movingPuzzleIndex = i
                break;
            }
        }
        if(movingPuzzle){
            if(e) e.preventDefault();
            cursorStyle = "grab";
            movingPuzzleOffset = {x: (x - (movingPuzzle.currentPos.x)), y: (y - movingPuzzle.currentPos.y)}
            let piece = puzzlePieces.splice(puzzlePieces.findIndex((p) => p.j == movingPuzzle.j && p.i == movingPuzzle.i), 1);
            puzzlePieces.push(piece[0]);
            puzzlePieces = puzzlePieces;
        }
    }

    function handleMousemove (x, y, e=null) {
        if(movingPuzzleOffset){
            if(e) e.preventDefault()
            movingPuzzle.currentPos.x = x - movingPuzzleOffset.x;
            movingPuzzle.currentPos.y = y - movingPuzzleOffset.y;
            puzzlePieces = puzzlePieces;
        }
    }

    function checkPuzzleSolved (){
        const isSolved = solvedPuzzles === puzzlePieces.length

        if(isSolved) {
            gameEnded.update(n => true);
        }
    }

    //deeclaring the sound
    let puzzle = false;
    let puzzleSound;

    function handleMouseup () {
        let timeout = null;
        if(movingPuzzle){
            cursorStyle = "default"
            let distThreshold = 30;
            const movingElementIndex = puzzlePieces.findIndex((p) => p.j == movingPuzzle.j && p.i == movingPuzzle.i);
            if(Math.abs(movingPuzzle.currentPos.x - movingPuzzle.correctPos.x) < distThreshold
            && Math.abs(movingPuzzle.currentPos.y - movingPuzzle.correctPos.y) < distThreshold){
                //if puzzle in correct place play sound
                puzzle = !puzzle;
                puzzleSound.play();
                timeout = setTimeout(() =>{
                    puzzle= false;
                    puzzleSound.pause();
                    puzzleSound.currentTime = 0;
                }, 500)

                movingPuzzle.currentPos.x = movingPuzzle.correctPos.x;
                movingPuzzle.currentPos.y = movingPuzzle.correctPos.y;

                let piece = puzzlePieces.splice(movingElementIndex, 1);

                if(!movingPuzzle.solved) {
                    piece[0].solved = true
                    solvedPuzzles = solvedPuzzles + 1;
                }

                if(timeout) clearTimeout(timeout)

                //make puzzles underneath be on top of the correct placed one
                puzzlePieces.unshift(piece[0]);
                puzzlePieces = puzzlePieces
            } else {
                if(movingPuzzle.solved) {
                    puzzlePieces[movingElementIndex].solved = false;
                    solvedPuzzles = solvedPuzzles - 1;
                }
            }

            movingPuzzleOffset = null;
            movingPuzzle = null;
        }

        checkPuzzleSolved()
    }

    function updateCoords(){
        OffsetCenteredX = (canvasWidth)/2 - imgW/2;
        canv.redraw();
    }

    let resizeTimeout;
    function handleResize () {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(updateCoords, 100);
    }

    const setup = ({ context, width, height }) => {
        //context.strokeStyle = '#ff0000';
        //generate puzzles
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                let positionX = (i * imgW/cols);
                let positionY = (height/2 - imgH/2) + (j * imgH/rows);
                let p = new Puzzle(i, j, {x: positionX, y: positionY}, {x: positionX, y: positionY}, imgW/cols, imgH/rows);
                puzzlePieces.push(p);
            }
        }

        //which piece in the grid it is
        let count = 0;
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                let row = j;
                let col = i;

                let p = puzzlePieces[count]
                if(row == rows-1){
                    p.shape.bottom = null;
                }
                else {
                    let hasTab = (Math.random() - 0.5) < 0 ? -1 : 1;
                    p.shape.bottom = hasTab * (Math.random() * 0.4 + 0.3);
                }

                if(col == cols-1){
                    p.shape.right = null;
                }
                else {
                    let hasTab = (Math.random() - 0.5) < 0 ? -1 : 1;
                    p.shape.right = hasTab * (Math.random() * 0.4 + 0.3);
                }

                if(row == 0){
                    p.shape.top = null;
                }
                else {
                    p.shape.top = -(puzzlePieces[count - 1].shape.bottom);
                }

                if(col == 0){
                    p.shape.left = null;
                }
                else {
                    p.shape.left = -(puzzlePieces[count - rows].shape.right);
                }
                count++;
            }
        }

        randomisePuzzles(puzzlePieces, width - imgW/cols, height - imgH/rows);

	}

    $: render = ({ context, width, height }) => {
        context.globalAlpha = bg_alpha_value;
        context.drawImage(img, width/2 - imgW/2, height/2 - imgH/2, imgW, imgH);
        context.globalAlpha = 1;
        if(bg_alpha_value == 0) {
            context.beginPath();
            context.rect(width/2 - imgW/2, height/2 - imgH/2, imgW, imgH);
            context.stroke();
        }

        for(let i = 0; i < puzzlePieces.length; i++){
            puzzlePieces[i].draw(context, img, OffsetCenteredX, rows);
        }
    };
</script>

<svelte:window bind:innerWidth={canvasWidth} on:resize={handleResize}/>

<Canvas width={canvasWidth} height={canvasHeight} style="margin: 0 auto; touch-action: none;border: 1px solid black; cursor: {cursorStyle};" bind:this={canv}
    on:mousedown={(e) => { handleMousedown(e.offsetX, e.offsetY)}}
    on:mousemove={(e) => {handleMousemove(e.offsetX, e.offsetY)}}
    on:mouseup={() => {handleMouseup()}}
    on:touchstart={(e) => handleMousedown(e.touches[0].clientX, e.touches[0].clientY, e)}
    on:touchmove ={(e) => {handleMousemove(e.touches[0].clientX, e.touches[0].clientY, e)}}
    on:touchend={() => {handleMouseup()}}>
    <Layer {render} {setup}/>
</Canvas>



<!-- declaring the audio source -->
<audio src={audio} preload=auto class="hidden" bind:this={puzzleSound} controls>
	<track kind="captions"/>
</audio>