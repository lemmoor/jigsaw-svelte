<script>
// @ts-nocheck
    import { Canvas, Layer, t } from "svelte-canvas";
    export let img;
    const rows = 3;
    const cols = 3;
    const scale = 0.8;
    // 920 - canvas size. 
    const resize = scale * Math.min(920/img.naturalWidth, 920/img.naturalHeight);
    const imgW = resize * img.naturalWidth;
    const imgH = resize * img.naturalHeight;
    let puzzlePieces = [];

    class Puzzle {
        constructor(i,  j, correctPos, currentPos) {
          this.width = imgW/cols;
          this.height = imgH/rows;
          this.i = i;
          this.j = j;
          this.correctPos = correctPos;
          this.currentPos = currentPos;
        }

        draw (ctx) {
            let w = img.naturalWidth/cols;
            let h = img.naturalHeight/rows;
            ctx.drawImage(img, this.i * w, this.j * h, w, h,
                            this.currentPos.x, this.currentPos.y, this.width, this.height);
            ctx.beginPath();
            ctx.moveTo(this.currentPos.x, this.currentPos.y);
            ctx.lineTo(this.currentPos.x +this.width, this.currentPos.y);
            ctx.lineTo(this.currentPos.x +this.width, this.currentPos.y + this.height);
            ctx.lineTo(this.currentPos.x, this.currentPos.y + this.height);
            ctx.closePath();
            ctx.stroke();
        }

    }

    function randomisePuzzles (p, maxX, maxY) {
        for(let i = 0; i < p.length; i++){
            p[i].currentPos.x = Math.floor(Math.random() * maxX);
            p[i].currentPos.y = Math.floor(Math.random() * maxY);
        }
    }

    const setup = ({ context, width, height }) => {
        for(let i = 0; i < cols; i++){
            for(let j = 0; j < rows; j++){
                let positionX = (width/2 - imgW/2) + (i * imgW/cols);
                let positionY = (height/2 - imgH/2) + (j * imgH/rows);
                let p = new Puzzle(i, j, {x: positionX, y: positionY}, {x: positionX, y: positionY});
                puzzlePieces.push(p);
            }
        }

        randomisePuzzles(puzzlePieces, width - imgW/cols, height - imgH/rows);
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

<Canvas width={920} height={920} style="border: 1px solid black;">
    <Layer {render} {setup}/>
</Canvas>

