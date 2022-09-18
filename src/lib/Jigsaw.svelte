<script>
// @ts-nocheck
    import { Canvas, Layer, t} from "svelte-canvas";
    export let img;
    window.devicePixelRatio = 1;
    const rows = 5;
    const cols = 5;
    const scale = 0.7 
    let canvasWidth = window.innerWidth;
    const canvasHeight = 1000;
    const resize = scale * Math.min(canvasWidth/img.naturalWidth, canvasHeight/img.naturalHeight);
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
            const size = Math.min(this.width, this.height);
            const tabBase = 0.08 * size;
            const tabWidth = 0.2 * size;
            const tabHeight = 0.2 * size;

            this.path = new Path2D();
            this.path.moveTo(this.currentPos.x, this.currentPos.y);
            //top right
            if(this.shape.top)
            {
                this.path.lineTo(this.currentPos.x + this.width * Math.abs(this.shape.top) - tabBase, this.currentPos.y)
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width * Math.abs(this.shape.top) - tabBase,
                    this.currentPos.y - tabHeight * Math.sign(this.shape.top) * 0.2,
                    this.currentPos.x + this.width * Math.abs(this.shape.top) - tabWidth,
                    this.currentPos.y - tabHeight * Math.sign(this.shape.top),
                    this.currentPos.x + this.width * Math.abs(this.shape.top), 
                    this.currentPos.y - tabHeight * Math.sign(this.shape.top)
                )
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width * Math.abs(this.shape.top) + tabWidth,
                    this.currentPos.y - tabHeight * Math.sign(this.shape.top),
                    this.currentPos.x + this.width * Math.abs(this.shape.top) + tabBase,
                    this.currentPos.y - tabHeight * Math.sign(this.shape.top) * 0.2,
                    this.currentPos.x + this.width * Math.abs(this.shape.top) + tabBase, 
                    this.currentPos.y
                )
            }
            this.path.lineTo(this.currentPos.x + this.width, this.currentPos.y);
            //bottom right
            if(this.shape.right){
                this.path.lineTo(this.currentPos.x + this.width, this.currentPos.y + this.height * Math.abs(this.shape.right) - tabBase);
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width - tabHeight * Math.sign(this.shape.right) * 0.2,
                    this.currentPos.y + this.height * Math.abs(this.shape.right) - tabBase,
                    this.currentPos.x + this.width - tabHeight * Math.sign(this.shape.right),
                    this.currentPos.y + this.height * Math.abs(this.shape.right) - tabWidth,
                    this.currentPos.x + this.width - tabHeight * Math.sign(this.shape.right),
                    this.currentPos.y + this.height * Math.abs(this.shape.right)
                )
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width - tabHeight * Math.sign(this.shape.right),
                    this.currentPos.y + this.height * Math.abs(this.shape.right) + tabWidth,
                    this.currentPos.x + this.width - tabHeight * Math.sign(this.shape.right) * 0.2,
                    this.currentPos.y + this.height * Math.abs(this.shape.right) + tabBase,
                    this.currentPos.x + this.width,
                    this.currentPos.y + this.height * Math.abs(this.shape.right) + tabBase
                )
            }
            this.path.lineTo(this.currentPos.x + this.width, this.currentPos.y + this.height);
            //bottom left
            if(this.shape.bottom){
                this.path.lineTo(this.currentPos.x + this.width * Math.abs(this.shape.bottom) + tabBase, this.currentPos.y + this.height)
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom) + tabBase,
                    this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom) * 0.2,
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom) + tabWidth,
                    this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom),
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom),
                    this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom)
                )
                this.path.bezierCurveTo(
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom) - tabWidth,
                    this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom),
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom) - tabBase,
                    this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom) * 0.2,
                    this.currentPos.x + this.width * Math.abs(this.shape.bottom) - tabBase,
                    this.currentPos.y + this.height
                )
            }
            this.path.lineTo(this.currentPos.x, this.currentPos.y + this.height);
            //top left
            if(this.shape.left){
                this.path.lineTo(this.currentPos.x, this.currentPos.y + this.height * Math.abs(this.shape.left) + tabBase);
                this.path.bezierCurveTo(
                    this.currentPos.x + tabHeight * Math.sign(this.shape.left) * 0.2,
                    this.currentPos.y + this.height * Math.abs(this.shape.left) + tabBase,
                    this.currentPos.x + tabHeight * Math.sign(this.shape.left),
                    this.currentPos.y + this.height * Math.abs(this.shape.left) + tabWidth,
                    this.currentPos.x + tabHeight * Math.sign(this.shape.left),
                    this.currentPos.y + this.height * Math.abs(this.shape.left)
                )
                this.path.bezierCurveTo(
                    this.currentPos.x + tabHeight * Math.sign(this.shape.left),
                    this.currentPos.y + this.height * Math.abs(this.shape.left) - tabWidth,
                    this.currentPos.x + tabHeight * Math.sign(this.shape.left) * 0.2,
                    this.currentPos.y + this.height * Math.abs(this.shape.left) - tabBase,
                    this.currentPos.x,
                    this.currentPos.y + this.height * Math.abs(this.shape.left) - tabBase
                )
            }
            this.path.lineTo(this.currentPos.x, this.currentPos.y);
            // this.path.closePath();

            ctx.save();
            ctx.clip(this.path);
            let w = img.naturalWidth/cols;
            let h = img.naturalHeight/rows;
            let scaledTabH = Math.min(w, h) * tabHeight/size;
            ctx.drawImage(img, this.i * w - scaledTabH, this.j * h - scaledTabH, w + scaledTabH*2, h + scaledTabH * 2,
                            this.currentPos.x - tabHeight, this.currentPos.y - tabHeight, this.width + tabHeight*2, this.height + tabHeight * 2);

            ctx.restore();
            ctx.stroke(this.path);
        }

    }

    function randomisePuzzles (p, maxX, maxY) {
        for(let i = 0; i < p.length; i++){
            p[i].currentPos.x = Math.floor(Math.random() * maxX);
            p[i].currentPos.y = Math.floor(Math.random() * maxY);
        }
    }  

    let canv;
    function handleMousedown (x, y) {
        let ctx = canv.getContext();
        for(let i = puzzlePieces.length - 1; i >=0; i--){
            if(ctx.isPointInPath(puzzlePieces[i].path, x, y)){
                movingPuzzle = puzzlePieces[i];
                console.log("ipip:", ctx.isPointInPath(puzzlePieces[i].path, x, y), movingPuzzle, x, y)
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
            movingPuzzleOffset = null;
            movingPuzzle = null;
        }
    }

    const setup = ({ context, width, height }) => {
        // context.strokeStyle = '#000000';
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

<svelte:window bind:innerWidth={canvasWidth} />

    <Canvas width={canvasWidth-50} height={canvasHeight} style="margin: 0 auto; border: 1px solid black" bind:this={canv}
        on:mousedown={(e) => { handleMousedown(e.offsetX, e.offsetY)}}
        on:mousemove={(e) => {handleMousemove(e.offsetX, e.offsetY);}}
        on:mouseup={() => {handleMouseup()}}>
        <Layer {render} {setup}/>
    </Canvas>


