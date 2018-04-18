/**
 * Init a Yuki object with a specific image and a series of parameters.
 * @param {Image} image An element to draw into the context. The specification permits any canvas image source (CanvasImageSource), specifically, a CSSImageValue, an HTMLImageElement, an SVGImageElement, an HTMLVideoElement, an HTMLCanvasElement, an ImageBitmap, or an OffscreenCanvas. 
 * @param {number} dx The X coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dy The Y coordinate in the destination canvas at which to place the top-left corner of the source image.
 * @param {number} dw The width to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in width when drawn.
 * @param {number} dh The height to draw the image in the destination canvas. This allows scaling of the drawn image. If not specified, the image is not scaled in height when drawn.
 * @param {number} alpha The canvas context's globalAlpha property. Default: 1.0.
 * @param {number} angle The angle to rotate clockwise in radians. You can use degree * Math.PI / 180 if you want to calculate from a degree value.
 * @param {number} tx Distance to move in the horizontal direction.
 * @param {number} ty Distance to move in the vertical direction.
 */
var Yuki = function (image, alpha, dx, dy, dw, dh, angle, tx, ty, sx, sy) {
    this.image = image;
    this.dx = dx;
    this.dy = dy;
    this.dw = dw || image.width;
    this.dh = dh || image.height;
    this.alpha = alpha || 1.0;
    this.angle = angle || 0;
    this.tx = tx || 0;
    this.ty = ty || 0;
    this.sx = sx || 1.0;
    this.sy = sy || 1.0;
};

Yuki.prototype = {
    createYuki: function (ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.translate(this.tx, this.ty);
        ctx.scale(this.sx, this.sy);
        ctx.rotate(this.angle);
        // Create a path can be detect by isPointInPath() method.
        ctx.rect(this.dx, this.dy, this.dw, this.dh);
        ctx.strokeStyle = 'rgba(0,0,0,0)';
        ctx.stroke();
        // Draw Image.
        ctx.drawImage(this.image, this.dx, this.dy, this.dw, this.dh);
        ctx.closePath();
        ctx.restore();
    },
    init: function (ctx) {
        this.createYuki(ctx);
    },
    setImage: function (image) {
        this.image = image;
    },
    moveTo: function (dx, dy) {
        this.dx = dx;
        this.dy = dy;
    },
    scaleTo: function (dw, dh) {
        this.dw = dw;
        this.dh = dh;
    },
    getAlpha: function () {
        return this.alpha;
    },
    setAlpha: function (alpha) {
        this.alpha = alpha;
    }
};