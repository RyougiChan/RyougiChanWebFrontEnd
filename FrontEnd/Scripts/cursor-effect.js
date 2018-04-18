var main = document.querySelector('.main-container'),
    bgYukiCanvas = document.querySelector('#bg-yuki'),
    canvas = document.querySelector('#bg-cursor'),
    bgYukiCtx = bgYukiCanvas.getContext('2d'),
    ctx = canvas.getContext('2d'),
    bgYukis = [],
    yukis = [],
    savedCanvasData,
    p;

function saveCanvas() {
    savedCanvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreCanvas() {
    ctx.putImageData(savedCanvasData, 0, 0);
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getRelPoint(e) {
    var clientX = e.clientX,
        clientY = e.clientY,
        rect = canvas.getBoundingClientRect(),
        left = rect.left,
        top = rect.top,
        x = clientX - left,
        y = clientY - top;

    return {
        x: x,
        y: y
    };
}

function getYukiImg(rNo, path) {
    var img = new Image();
    if (rNo === 0) rNo = 1;
    // img.src = path + '/yuki_' + (rNo <= 9 ? '0' + rNo : rNo) + '.png';
    img.src = path + '/yuki_55.png';
    return img;
}

function initYukis(ctx, yukis, path, num) {
    if(yukis.length === 0) {
        for (var i = 0; i < num; i++) {
            var x = Math.random() > 0.5 ? Math.random() * canvas.width : -Math.random() * canvas.width,
            y = Math.random() > 0.5 ? Math.random() * canvas.height : -Math.random() * canvas.height;
    
            createYuki(ctx, yukis, path, {x: x, y: y}, 1);
        }
    }
}
initYukis(bgYukiCtx, bgYukis, '../images', 52);

function createYuki(ctx, yukis, path, p, alpha, no) {
    var rNo = no || Math.round(Math.random() * 54),
        img = getYukiImg(rNo, path),
        a = alpha || 1.0;
    img.onload = function () {
        var yuki = new Yuki(img, a, p.x, p.y);
        yuki.createYuki(ctx);
        yukis.push({ yuki: yuki, sp: p });
    };
}

function drawYukis(yukis, ctx) {
    yukis.forEach(function (yuki) {
        yuki.yuki.createYuki(ctx);
    }, this);
}

function updateYukis(yukis, p) {
    yukis.forEach(function (yuki) {
        var y = yuki.yuki,
            sp = p || yuki.sp;
        if (y.alpha > 0) {
            y.alpha -= 1 / 480;
            // y.dx += Math.random() > 0.5 ? Math.random() * 1 : -Math.random() * 1;
            y.dx += Math.random() * 1;
            y.dy += Math.random() * 1;
        } else {
            y.dx = sp.x;
            y.dy = sp.y;
            y.alpha = 1;
        }
    }, this);
}

function updateBgYukis(yukis, p) {
    yukis.forEach(function (yuki) {
        var y = yuki.yuki,
            sp = p || yuki.sp;
        if (y.dy + y.ty < canvas.height) {
            var deltaX = Math.random() * 1,
                deltaY = Math.random() * 1;
            y.tx += deltaX;
            y.ty += deltaY;
            // y.dx += deltaX;
            // y.dy += deltaY;
            y.alpha = (canvas.height - y.dy - y.ty) / canvas.height;
            // y.dx += Math.random() > 0.5 ? Math.random() * 1 : -Math.random() * 1;
            // y.tx = y.dx + y.dw / 2;
            // y.ty = y.dy + y.dy / 2;
            // y.angle += Math.random() * 1 * Math.PI / 360;
        } else {
            y.dx = sp.x;
            y.dy = 0;
            y.tx = 0;
            y.ty = 0;
            y.alpha = 1;
        }
    }, this);
}

setInterval(function () {
    clearCanvas(bgYukiCtx);
    
    updateBgYukis(bgYukis);
    drawYukis(bgYukis, bgYukiCtx);
});

function drawEffect(p) {
    clearCanvas(ctx);

    updateYukis(yukis, p);
    drawYukis(yukis, ctx);
    
}

var intervalID,
    anim;
function mouseMoveHandler(e) {
    // if (intervalID) clearInterval(intervalID);
    // var p = getRelPoint(e),
    //     x = p.x,
    //     y = p.y,
    //     a = 1,
    //     // Number of yuki
    //     n = 8,
    //     h = 240;
        
    // if (yukis.length === 0) {
    //     for (var i = 0; i < n; i++) {
    //         var tp = { x: x, y: y };
    //         createYuki(ctx, yukis, 'images-s', tp, a);
    //         y += h / n;
    //         a -= 1 / n;
    //     }
    // }
    
    // intervalID = setInterval(function () {
    //     drawEffect(p);
    // });
}

function mouseOutHandler(e) {
    // if (intervalID) clearInterval(intervalID);    
    clearCanvas(ctx);
}

function mouseOverHandler(e) {

}

saveCanvas();
function mouseDownHandler(e) {

}

function mouseUpHandler(e) {

}

function log(s) {
    console.log(s);
}

canvas.addEventListener('mousemove', mouseMoveHandler);
canvas.addEventListener('mouseover', mouseOverHandler);
canvas.addEventListener('mouseout', mouseOutHandler);
canvas.addEventListener('mousedown', mouseDownHandler);
canvas.addEventListener('mouseup', mouseUpHandler);

main.addEventListener('mousemove', mouseMoveHandler);
main.addEventListener('mouseout', mouseOutHandler);
