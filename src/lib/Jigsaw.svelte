<script>
// @ts-nocheck
    import { Canvas, Layer, t } from "svelte-canvas";
    export let img;
    const rows = 4;
    const cols = 3;
    const scale = 0.6;
    // 920 - canvas size. 
    const resize = scale * Math.min(920/img.naturalWidth, 920/img.naturalHeight);
    const imgW = resize * img.naturalWidth;
    const imgH = resize * img.naturalHeight;
    let puzzlePieces = [];
    let movingPuzzleOffset;
    let movingPuzzle;

    class Puzzle {
        constructor(i,  j, correctPos, currentPos) {
          this.width = imgW/cols;
          this.height = imgH/rows;
          this.i = i;
          this.j = j;
          this.correctPos = correctPos;
          this.currentPos = currentPos;
          this.path = null;
          this.shape = {};
        }

        draw (ctx) {
            let w = img.naturalWidth/cols;
            let h = img.naturalHeight/rows;
            ctx.drawImage(img, this.i * w, this.j * h, w, h,
                            this.currentPos.x, this.currentPos.y, this.width, this.height);
            this.path = new Path2D();
            // ctx.beginPath();
            this.path.moveTo(this.currentPos.x, this.currentPos.y);
            this.path.lineTo(this.currentPos.x +this.width, this.currentPos.y);
            this.path.lineTo(this.currentPos.x +this.width, this.currentPos.y + this.height);
            this.path.lineTo(this.currentPos.x, this.currentPos.y + this.height);
            this.path.closePath();
            ctx.stroke(this.path);
        }

    }

    function randomisePuzzles (p, maxX, maxY) {
        for(let i = 0; i < p.length; i++){
            p[i].currentPos.x = Math.floor(Math.random() * maxX);
            p[i].currentPos.y = Math.floor(Math.random() * maxY);
        }
    }  

    let ctx;
    function handleMousedown (x, y) {
        for(let i = puzzlePieces.length - 1; i >=0; i--){
            if(ctx.isPointInPath(puzzlePieces[i].path, x, y)){
                movingPuzzle = puzzlePieces[i];
                break;
            }
        }
        if(movingPuzzle){
            movingPuzzleOffset = {x: (x - movingPuzzle.currentPos.x), y: (y - movingPuzzle.currentPos.y)}
            let piece = puzzlePieces.splice(puzzlePieces.findIndex((p) => p.j == movingPuzzle.j && p.i == movingPuzzle.i), 1);
            puzzlePieces.push(piece[0]);
            puzzlePieces = puzzlePieces;
        }
    }

    function handleMousemove (x, y) {
        if(movingPuzzleOffset){
            movingPuzzle.currentPos.x = x - movingPuzzleOffset.x;
            movingPuzzle.currentPos.y = y - movingPuzzleOffset.y;
            puzzlePieces = puzzlePieces;
        }
    }

    function handleMouseup () {
        if(movingPuzzle){
            let distThreshold = 30;
            if(Math.abs(movingPuzzle.currentPos.x - movingPuzzle.correctPos.x) < distThreshold 
            && Math.abs(movingPuzzle.currentPos.y - movingPuzzle.correctPos.y) < distThreshold){
                movingPuzzle.currentPos.x = movingPuzzle.correctPos.x;
                movingPuzzle.currentPos.y = movingPuzzle.correctPos.y;
                //make puzzles underneath be on top of the correct placed one
                let piece = puzzlePieces.splice(puzzlePieces.findIndex((p) => p.j == movingPuzzle.j && p.i == movingPuzzle.i), 1);
                puzzlePieces.unshift(piece[0]);
                puzzlePieces = puzzlePieces;
            }
            console.log(movingPuzzle)
            movingPuzzleOffset = null;
            movingPuzzle = null;
        }
    }

    const setup = ({ context, width, height }) => {
        // context.strokeStyle = '#000000';
        //there has to be a better way but idk
        ctx = context;
        //generate puzzles
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                let positionX = (width/2 - imgW/2) + (i * imgW/cols);
                let positionY = (height/2 - imgH/2) + (j * imgH/rows);
                let p = new Puzzle(i, j, {x: positionX, y: positionY}, {x: positionX, y: positionY});
                puzzlePieces.push(p);
            }
        }

        //which piece in the grid it is
        let count = 0;
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                //in case i ever find the place where i and j switched. (i should be row, j - col).
                let row = j;
                let col = i;

                let p = puzzlePieces[count]
                // console.log(p, 'r: ', row, 'c:', col, count)
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

        // console.log(puzzlePieces)
        // randomisePuzzles(puzzlePieces, width - imgW/cols, height - imgH/rows);

	}

    $: render = ({ context, width, height }) => {
        context.globalAlpha = 0.4;
        context.drawImage(img, width/2 - imgW/2, height/2 - imgH/2, imgW, imgH);
        context.globalAlpha = 1;

        for(let i = 0; i < puzzlePieces.length; i++){
            puzzlePieces[i].draw(context);
        }

    };
</script>

<Canvas width={920} height={920} style="border: 1px solid black;" 
    on:mousedown={(e) => { handleMousedown(e.offsetX, e.offsetY)}}
    on:mousemove={(e) => {handleMousemove(e.offsetX, e.offsetY);}}
    on:mouseup={() => {handleMouseup()}}>
    <Layer {render} {setup}/>
</Canvas>

