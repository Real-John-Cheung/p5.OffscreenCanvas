/**
 * OffscreenCanvas extends p5.Graphics
 * 
 * @module OffscreenCanvas
 * @author JohnC
 */

const _createOffscreenCanvas = function (w, h, renderer) {
    if (typeof OffscreenCanvas === "undefined") throw new Error("OffscreenCanvas is not supported by this browser!");
    const oc = new OC(w, h, renderer, this);
    return oc;
}

p5.prototype.createOffscreenCanvas = _createOffscreenCanvas;

class OC {

    /**
     * Constructor for the OffscreenCanvas wrapper
     * 
     * @param {number} w width of the canvas
     * @param {number} h height of the canvas
     * @param {p5.Constant} renderer the renderer to use, either p5.P2D or p5.WEBGL
     * @param {p5} pInst pointer to the p5 instance
     */
    constructor(w, h, renderer, pInst) {
        const r = renderer || pInst.P2D;
        this.canvas = new OffscreenCanvas(w, h);
        this.canvas.context = this.canvas.getContext(r === pInst.WEBGL ? 'webgl' : '2d');
        this.canvas.style = {} // trick
        for (const p in p5.prototype) {
            if (!this[p]) {
                if (typeof p5.prototype[p] === 'function') {
                    this[p] = p5.prototype[p].bind(this);
                } else {
                    this[p] = p5.prototype[p];
                }
            }
        }
        p5.prototype._initializeInstanceVariables.apply(this);
        this.width = w;
        this.height = h;
        this._pixelDensity = pInst._pixelDensity;
        if (r === pInst.WEBGL) {
            this._renderer = new p5.RendererGL(this.canvas, pInst, false);
        } else {
            this._renderer = new p5.Renderer2D(this.canvas, pInst, false);
        }
        
        //
        pInst._elements.push(this);

        Object.defineProperty(this, 'deltaTime', {
            get: function () {
                return this._pInst.deltaTime;
            }
        });

        this._renderer.resize(w, h);
        this._renderer._applyDefaults();
        return this;
    }

    /**
     * reset the offscreen canvas context matrix
     */
    reset() {
        this._renderer.resetMatrix();
        if (this._renderer.isP3D) {
            this._renderer._update();
        }
    }

    /**
     * remove this offscreen canvas from p5 instance
     */
    remove() {
        const idx = this._pInst._elements.indexOf(this);
        if (idx !== -1) {
            this._pInst._elements.splice(idx, 1);
        }
    }

    /**
     * return a bitmap image of the current render of the offscreen render
     * @returns a ImageBitmap object
     */
    currentFrame() {
        return this.canvas.transferToImageBitmap();
    }

    /**
     * creates a Blob object representing the image contained in the canvas
     * @param {object} options an object containing the options, see https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob 
     * @param {function} callback an callback to handle the promise
     * @returns a Promise returning a Blob object if a callback is not specified 
     */
    currentBlob(options, callback) {
        if (callback) {
            this.canvas.convertToBlob(options).then(callback);
        } else {
            return this.canvas.convertToBlob(options);
        }
    }
}
