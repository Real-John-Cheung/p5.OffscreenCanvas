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

// overwrite 2D renderer image function to allow drawing imageBitmap & offscreenCanvas object
const _image2D = function (img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    let cnv;
    if (img.gifProperties) {
        img._animateGif(this._pInst);
    }

    try {
        if (p5.MediaElement && img instanceof p5.MediaElement) {
            img._ensureCanvas();
        }
        if (this._tint && img.canvas) {
            cnv = this._getTintedImageCanvas(img);
        }
        if (!cnv) {
            cnv = img.canvas || img.elt;
        }
        if (img instanceof ImageBitmap) {
            cnv = img;
        }
        if (img instanceof OffscreenCanvas) {
            cnv = img;
        }
        let s = 1;
        if (img.width && img.width > 0) {
            if (img instanceof ImageBitmap || img instanceof OffscreenCanvas) {
                s = this._pInst._pixelDensity;
            } else {
                s = cnv.width / img.width;
            }
        }
        if (this._isErasing) {
            this.blendMode(this._cachedBlendMode);
        }
        this.drawingContext.drawImage(
            cnv,
            s * sx,
            s * sy,
            s * sWidth,
            s * sHeight,
            dx,
            dy,
            dWidth,
            dHeight
        );
        if (this._isErasing) {
            this._pInst.erase();
        }
    } catch (e) {
        if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
            throw e;
        }
    }
}
p5.prototype.createOffscreenCanvas = _createOffscreenCanvas;
p5.Renderer2D.prototype.image = _image2D;

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
        this.r = r;
        this._pInst = pInst;
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
     * this action will transfer all content in the canvas to the imagebitmap object
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

    /**
     * return the transferable OffscreenCanvas object
     * @returns the OffscreenCanvas Object
     */
    currentCanvas() {
        return this.canvas;
    }

    /**
     * load a transferable OffscreenCanvas object 
     * this action will create a new rederer if the loaded canvas' drawing context is different from the current one
     * else the drawing context properties (e.g. fill and stroke color in 2d context) are also loaded.
     * this action will not copy the OffscreenCanvas object
     * @param {OffscreenCanvas} comingCanvas 
     */
    loadCanvas(comingCanvas) {
        this.canvas = comingCanvas;
        this.width = comingCanvas.width / this._pixelDensity;
        this.height = comingCanvas.height / this._pixelDensity;
        let comingR;
        if (!this.canvas.context) {
            this.canvas.context = this.canvas.getContext(this.r === this._pInst.WEBGL ? 'webgl' : '2d');
        } else {
            if (this.canvas.context instanceof OffscreenCanvasRenderingContext2D) {
                comingR = this._pInst.P2D;
            } else if (this.canvas.context instanceof WebGL2RenderingContext || this.canvas.context instanceof WebGLRenderingContext) {
                comingR = this._pInst.WEBGL;
            }
        }

        if ((comingR && comingR !== this.r) || !comingR) {
            this.r = comingR ? comingR : this.r;
            if (this.r === this._pInst.WEBGL) {
                this._renderer = new p5.RendererGL(this.canvas, this._pInst, false);
            } else {
                this._renderer = new p5.Renderer2D(this.canvas, this._pInst, false);
            }
        } else if (comingR === this._pInst.P2D) {
            //2d
            this._renderer._pInst = this._pInst;
            this._renderer._pixelsState = this._pInst;
            this._renderer.width = this.canvas.width / this._pixelDensity;
            this._renderer.height = this.canvas.height / this._pixelDensity;
            this._renderer.canvas = this.canvas;
            this._renderer.drawingContext = this.canvas.context;
            this._renderer._pInst._setProperty('drawingContext', this._renderer.drawingContext);
        } else {
            //webgl
            this._renderer._pInst = this._pInst;
            this._renderer._pixelsState = this._pInst;
            this._renderer.width = this.canvas.width / this._pixelDensity;
            this._renderer.height = this.canvas.height / this._pixelDensity;
            //
            this._renderer.drawingContext = this.canvas.context;
            this._renderer.drawingContext.enable(this._renderer.drawingContext.DEPTH_TEST);
            this._renderer.drawingContext.depthFunc(this._renderer.drawingContext.LEQUAL);
            this._renderer.drawingContext.viewport(0, 0, this._renderer.drawingContext.drawingBufferWidth, this._renderer.drawingContext.drawingBufferHeight);
            this._renderer._viewport = this._renderer.drawingContext.getParameter(
                this._renderer.drawingContext.VIEWPORT
            );
            //
            this._renderer.GL = this._renderer.drawingContext;
            this._renderer._pInst._setProperty('drawingContext', this._renderer.drawingContext);
        }
    }
}
