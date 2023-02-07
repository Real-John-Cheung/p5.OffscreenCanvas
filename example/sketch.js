setup = function () {
    createCanvas(200, 200);
    background(100);
    let a = createOffscreenCanvas(100, 100, WEBGL);
    let b = createGraphics(100, 100, WEBGL);
    let c = createOffscreenCanvas(100, 100, P2D);
    let d = createGraphics(100, 100);

    const worker = new Worker("worker.js");
    console.log(a);

    a.fill(100);
    a.rect(-50, -50, 100);
    a.fill(255);
    a.ellipse(10, 10, 10);
    a.rectMode(CENTER);
    a.rect(30, 10, 10);
    a.rotateX(PI / 4);
    a.rotateZ(PI / 4);
    a.box(10, 10, 10);

    b.fill(100);
    b.rect(-50, -50, 100);
    b.fill(255);
    b.ellipse(10, 10, 10);
    b.rectMode(CENTER);
    b.rect(30, 10, 10);
    b.rotateX(PI / 4);
    b.rotateZ(PI / 4);
    b.box(10, 10, 10);

    c.background(200);
    c.blendMode(BURN);
    c.noStroke();
    c.fill(255, 0, 0);
    c.rect(40, 40, 50);
    c.fill(0, 255, 0);
    c.rect(60, 60, 50);

    d.background(200);
    d.blendMode(BURN);
    d.noStroke();
    d.fill(255, 0, 0);
    d.rect(40, 40, 50);
    d.fill(0, 255, 0);
    d.rect(60, 60, 50);

    image(a, 0, 0);
    image(b, 100, 100);
    image(c, 100, 0);
    image(d, 0, 100);
}