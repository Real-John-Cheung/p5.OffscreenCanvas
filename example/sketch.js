setup = function () {
    let timer = 0
    createCanvas(400, 200);
    background(100);
    fill(0);
    noStroke();

    // compare offscreen canvas and p5.Graphics
    let a = createOffscreenCanvas(100, 100, WEBGL);
    let b = createGraphics(100, 100, WEBGL);
    let c = createOffscreenCanvas(100, 100, P2D);
    let d = createGraphics(100, 100);
    timer = millis();
    a.fill(100);
    a.rect(-50, -50, 100);
    a.fill(150);
    a.ellipse(10, 10, 10);
    a.rectMode(CENTER);
    a.rect(30, 10, 10);
    a.rotateX(PI / 4);
    a.rotateZ(PI / 4);
    a.box(10, 10, 10);
    console.log("OC:", millis() - timer);
    timer = millis();

    b.fill(100);
    b.rect(-50, -50, 100);
    b.fill(150);
    b.ellipse(10, 10, 10);
    b.rectMode(CENTER);
    b.rect(30, 10, 10);
    b.rotateX(PI / 4);
    b.rotateZ(PI / 4);
    b.box(10, 10, 10);
    console.log("PG:", millis() - timer);
    timer = millis();

    c.background(200);
    c.blendMode(BURN);
    c.noStroke();
    c.fill(0, 0, 255);
    c.rect(20, 20, 50);
    c.fill(255, 0, 0);
    c.rect(40, 40, 50);
    c.fill(0, 255, 0);
    c.rect(60, 60, 50);
    console.log("OC:", millis() - timer);
    timer = millis();

    d.background(200);
    d.blendMode(BURN);
    d.noStroke();
    d.fill(0, 0, 255);
    d.rect(20, 20, 50);
    d.fill(255, 0, 0);
    d.rect(40, 40, 50);
    d.fill(0, 255, 0);
    d.rect(60, 60, 50);
    console.log("PG:", millis() - timer);

    image(a, 0, 0);
    text("OC", 0, 10);
    image(b, 0, 100);
    text("PG", 0, 110);
    image(c, 100, 0);
    text("OC", 100, 10);
    image(d, 100, 100);
    text("PG", 100, 110);

    // load Canvas, note that new drawing will also be in the old canvas
    const cc = c.currentCanvas();
    let e = createOffscreenCanvas(100, 100, P2D);
    e.loadCanvas(cc);
    e.noStroke();
    e.rect(0, 0, 10);
    const ac = a.currentCanvas();
    let f = createOffscreenCanvas(100, 100, WEBGL);
    f.loadCanvas(ac);
    f.rect(30, 10, 10);

    image(e, 200, 0);
    image(f, 200, 100);

    //worker, more details see the comments in worker.js
    const worker = new Worker("./worker.js");
    worker.postMessage({ pixelDensity: pixelDensity() });
    worker.onmessage = (e) => {
        image(e.data.imgs[0], 300, 0);
        image(e.data.imgs[1], 300, 100);
        text("Worker", 300, 10);
        text("Worker", 300, 110);
    };
}