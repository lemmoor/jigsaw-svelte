export default class Puzzle {
	constructor(i, j, correctPos, currentPos, width, height) {
		this.width = width;
		this.height = height;
		this.i = i;
		this.j = j;
		this.correctPos = { x: correctPos.x, y: correctPos.y };
		this.currentPos = { x: currentPos.x, y: currentPos.y };
		this.path = null;
		this.borderpath = null;
		this.shape = {};
		this.solved = false;
	}

	draw(ctx, img, OffsetCenteredX, rows, cols = rows) {
		const size = Math.min(this.width, this.height);
		const tabBase = 0.08 * size;
		const tabWidth = 0.2 * size;
		const tabHeight = 0.2 * size;
		let x = this.currentPos.x + OffsetCenteredX;

		this.path = new Path2D();
		this.path.moveTo(x, this.currentPos.y);
		//top right
		if (this.shape.top) {
			this.path.lineTo(x + this.width * Math.abs(this.shape.top) - tabBase, this.currentPos.y);
			this.path.bezierCurveTo(
				x + this.width * Math.abs(this.shape.top) - tabBase,
				this.currentPos.y - tabHeight * Math.sign(this.shape.top) * 0.2,
				x + this.width * Math.abs(this.shape.top) - tabWidth,
				this.currentPos.y - tabHeight * Math.sign(this.shape.top),
				x + this.width * Math.abs(this.shape.top),
				this.currentPos.y - tabHeight * Math.sign(this.shape.top)
			);
			this.path.bezierCurveTo(
				x + this.width * Math.abs(this.shape.top) + tabWidth,
				this.currentPos.y - tabHeight * Math.sign(this.shape.top),
				x + this.width * Math.abs(this.shape.top) + tabBase,
				this.currentPos.y - tabHeight * Math.sign(this.shape.top) * 0.2,
				x + this.width * Math.abs(this.shape.top) + tabBase,
				this.currentPos.y
			);
		}
		this.path.lineTo(x + this.width, this.currentPos.y);
		//bottom right
		if (this.shape.right) {
			this.path.lineTo(
				x + this.width,
				this.currentPos.y + this.height * Math.abs(this.shape.right) - tabBase
			);
			this.path.bezierCurveTo(
				x + this.width - tabHeight * Math.sign(this.shape.right) * 0.2,
				this.currentPos.y + this.height * Math.abs(this.shape.right) - tabBase,
				x + this.width - tabHeight * Math.sign(this.shape.right),
				this.currentPos.y + this.height * Math.abs(this.shape.right) - tabWidth,
				x + this.width - tabHeight * Math.sign(this.shape.right),
				this.currentPos.y + this.height * Math.abs(this.shape.right)
			);
			this.path.bezierCurveTo(
				x + this.width - tabHeight * Math.sign(this.shape.right),
				this.currentPos.y + this.height * Math.abs(this.shape.right) + tabWidth,
				x + this.width - tabHeight * Math.sign(this.shape.right) * 0.2,
				this.currentPos.y + this.height * Math.abs(this.shape.right) + tabBase,
				x + this.width,
				this.currentPos.y + this.height * Math.abs(this.shape.right) + tabBase
			);
		}
		this.path.lineTo(x + this.width, this.currentPos.y + this.height);
		//bottom left
		if (this.shape.bottom) {
			this.path.lineTo(
				x + this.width * Math.abs(this.shape.bottom) + tabBase,
				this.currentPos.y + this.height
			);
			this.path.bezierCurveTo(
				x + this.width * Math.abs(this.shape.bottom) + tabBase,
				this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom) * 0.2,
				x + this.width * Math.abs(this.shape.bottom) + tabWidth,
				this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom),
				x + this.width * Math.abs(this.shape.bottom),
				this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom)
			);
			this.path.bezierCurveTo(
				x + this.width * Math.abs(this.shape.bottom) - tabWidth,
				this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom),
				x + this.width * Math.abs(this.shape.bottom) - tabBase,
				this.currentPos.y + this.height + tabHeight * Math.sign(this.shape.bottom) * 0.2,
				x + this.width * Math.abs(this.shape.bottom) - tabBase,
				this.currentPos.y + this.height
			);
		}
		this.path.lineTo(x, this.currentPos.y + this.height);
		//top left
		if (this.shape.left) {
			this.path.lineTo(x, this.currentPos.y + this.height * Math.abs(this.shape.left) + tabBase);
			this.path.bezierCurveTo(
				x + tabHeight * Math.sign(this.shape.left) * 0.2,
				this.currentPos.y + this.height * Math.abs(this.shape.left) + tabBase,
				x + tabHeight * Math.sign(this.shape.left),
				this.currentPos.y + this.height * Math.abs(this.shape.left) + tabWidth,
				x + tabHeight * Math.sign(this.shape.left),
				this.currentPos.y + this.height * Math.abs(this.shape.left)
			);
			this.path.bezierCurveTo(
				x + tabHeight * Math.sign(this.shape.left),
				this.currentPos.y + this.height * Math.abs(this.shape.left) - tabWidth,
				x + tabHeight * Math.sign(this.shape.left) * 0.2,
				this.currentPos.y + this.height * Math.abs(this.shape.left) - tabBase,
				x,
				this.currentPos.y + this.height * Math.abs(this.shape.left) - tabBase
			);
		}
		this.path.lineTo(x, this.currentPos.y);

		ctx.save();
		ctx.clip(this.path);
		let w = img.naturalWidth / cols;
		let h = img.naturalHeight / rows;
		let scaledTabH = (Math.min(w, h) * tabHeight) / size;
		ctx.drawImage(
			img,
			this.i * w - scaledTabH,
			this.j * h - scaledTabH,
			w + scaledTabH * 2,
			h + scaledTabH * 2,
			x - tabHeight,
			this.currentPos.y - tabHeight,
			this.width + tabHeight * 2,
			this.height + tabHeight * 2
		);

		ctx.restore();
		ctx.stroke(this.path);
	}
}
