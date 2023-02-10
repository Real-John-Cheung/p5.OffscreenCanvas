// templ based on https://glitch.com/edit/#!/p5js-web-worker
let loadHandlers = [];

window = {
    performance: performance,
    document: {
        hasFocus: () => true,
        createElementNS: (ns, elem) => {
            return {};
        }
    },
    screen: {},
    addEventListener: (e, handler) => {
        if (e === "load") {
            loadHandlers.push(handler);
        } else {
        }
    },
    removeEventListener: () => { },
    location: {
        href: "about:blank",
        origin: "null",
        protocol: "about:",
        host: "",
        hostname: "",
        port: "",
        pathname: "blank",
        search: "",
        hash: ""
    }
};

document = window.document;
screen = window.screen;

importScripts("p5.min.js");

for (const handler of loadHandlers) {
    handler();
}

const p5 = window.p5;

importScripts("./p5.OffscreenCanvas.js");

this.onmessage = (event) => {
    // we need to use instance mode inside worker
    let sketch = (s) => {
        // note that pixelDensity might be different inside worker thread
        let pixelDensityScale = event.data.pixelDensity / s.pixelDensity();
        const w = 100, h = 100;
        let oc = s.createOffscreenCanvas(w * pixelDensityScale, h * pixelDensityScale);
        oc.scale(pixelDensityScale);
        oc.background(200);
        oc.blendMode(s.BURN);
        oc.noStroke();
        oc.fill(0, 0, 255);
        oc.rect(20, 20, 50);
        oc.fill(255, 0, 0);
        oc.rect(40, 40, 50);
        oc.fill(0, 255, 0);
        oc.rect(60, 60, 50);
        oc.fill(0);
        oc.noStroke();
        let bitmap0 = oc.currentFrame();
        // this clean the offscreen canvas too
        oc = s.createOffscreenCanvas(w * pixelDensityScale, h * pixelDensityScale, s.WEBGL);
        oc.scale(pixelDensityScale);
        oc.fill(100);
        oc.rect(-50, -50, 100);
        oc.fill(150);
        oc.ellipse(10, 10, 10);
        oc.rectMode(s.CENTER);
        oc.rect(30, 10, 10);
        oc.rotateX(s.PI / 4);
        oc.rotateZ(s.PI / 4);
        oc.box(10, 10, 10);
        let bitmap1 = oc.currentFrame();
        this.postMessage({ imgs: [bitmap0, bitmap1] })
    }

    new p5(sketch);
}