let sketch = (s) => { 
    s.setup = function () {
        let timer = 0
        s.createCanvas(400, 200);
        s.background(100);
        s.fill(0);
        s.noStroke();
    
        // compare offscreen canvas and p5.Graphics
        let a = s.createOffscreenCanvas(100, 100, s.WEBGL);
        let b = s.createGraphics(100, 100, s.WEBGL);
        let c = s.createOffscreenCanvas(100, 100, s.P2D);
        let d = s.createGraphics(100, 100);
        timer = s.millis();
        a.fill(100);
        a.rect(-50, -50, 100);
        a.fill(150);
        a.ellipse(10, 10, 10);
        a.rectMode(s.CENTER);
        a.rect(30, 10, 10);
        a.rotateX(s.PI / 4);
        a.rotateZ(s.PI / 4);
        a.box(10, 10, 10);
        timer = s.millis();
    
        b.fill(100);
        b.rect(-50, -50, 100);
        b.fill(150);
        b.ellipse(10, 10, 10);
        b.rectMode(s.CENTER);
        b.rect(30, 10, 10);
        b.rotateX(s.PI / 4);
        b.rotateZ(s.PI / 4);
        b.box(10, 10, 10);
        timer = s.millis();
    
        c.background(200);
        c.blendMode(s.BURN);
        c.noStroke();
        c.fill(0, 0, 255);
        c.rect(20, 20, 50);
        c.fill(255, 0, 0);
        c.rect(40, 40, 50);
        c.fill(0, 255, 0);
        c.rect(60, 60, 50);
        timer = s.millis();
    
        d.background(200);
        d.blendMode(s.BURN);
        d.noStroke();
        d.fill(0, 0, 255);
        d.rect(20, 20, 50);
        d.fill(255, 0, 0);
        d.rect(40, 40, 50);
        d.fill(0, 255, 0);
        d.rect(60, 60, 50);
    
        s.image(a, 0, 0);
        s.text("OC", 0, 10);
        s.image(b, 0, 100);
        s.text("PG", 0, 110);
        s.image(c, 100, 0);
        s.text("OC", 100, 10);
        s.image(d, 100, 100);
        s.text("PG", 100, 110);
    
        // load Canvas, note that new drawing will also be in the old canvas
        const cc = c.currentCanvas();
        let e = s.createOffscreenCanvas(100, 100, s.P2D);
        e.loadCanvas(cc);
        e.noStroke();
        e.rect(0, 0, 10);
        const ac = a.currentCanvas();
        let f = s.createOffscreenCanvas(100, 100, s.WEBGL);
        f.loadCanvas(ac);
        f.rect(30, 10, 10);
    
        s.image(e, 200, 0);
        s.image(f, 200, 100);
    
        //worker, more details see the comments in worker.js
        const worker = new Worker("./worker.js");
        worker.postMessage({ pixelDensity: s.pixelDensity() });
        worker.onmessage = (e) => {
            s.image(e.data.imgs[0], 300, 0);
            s.image(e.data.imgs[1], 300, 100);
            s.text("Worker", 300, 10);
            s.text("Worker", 300, 110);
        };
    }
}