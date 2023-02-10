// templ based on https://glitch.com/edit/#!/p5js-web-worker
let loadHandlers = [];

window = {
    performance: performance,
    document: {
        hasFocus: () => true,
        createElementNS: (ns, elem) => {
            console.warn(`p5.js tryied to created oc DOM element '${ns}:${elem}`);
            return {};
        }
    },
    screen: {},
    addEventListener: (e, handler) => {
        if (e === "load") {
            loadHandlers.push(handler);
        } else {
            console.warn(`p5.js tried to added an event listener for '${e}'`);
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
       // see example for how to use this template
    }

    new p5(sketch);
}