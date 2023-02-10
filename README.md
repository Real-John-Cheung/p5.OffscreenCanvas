# p5.OffscreenCanvas
A library for manipulating OffscreenCanvas with p5

## Usage
Download the `p5.OffscreenCanvas.js` file in `dist` folder and put it in your project.

<b>Important</b> it should be loaded after p5, your `index.html` file should look something like this
```
...
<script src="path/to/p5"></script>
<script src="path/to/p5.OffscreenCanvas"></script>
<script src="path/to/sketch"></script>
...
```

This little wrapper provides a new function `createOffscreenCanvas`, which return a `p5.Graphics`-like object. It can be used to draw things off screen with the `OffscreenCanvas` Object instead of creating a new `canvas` in the dom tree. The `OffscreenCanvas` object can be also use in worker thread. This library also overwrite the `image` function for the 2D renderer to allow it to display `ImageBitmap` and `OffscreenCanvas` object.

See files in the `example` folder for more information.

## Worker template
There is also a template for using this library with worker (`worker-templ.js`) in `dist` folder. You can use it to start your project with web worker. You can find more about how to do it in the code comments.

## API

### `createOffscreenCanvas`
Type: function

Arguments: `width`, `height`, `[renderer = P2D]`

Create a new wrapper object (of class `OC`) of a `OffscreenCanvas` object with the given width and height.

### `OC.reset`
Type: function

Argument: none

Reset the offscreen canvas context matrix.

### `OC.remove`
Type: function

Argument: none

Remove this offscreen canvas from the p5 instance.

### `OC.currentFrame`
Type: function

Argument: none

Return: a ImageBitmap object

Return a bitmap image of the current render of the offscreen render this action will transfer all content in the canvas to the ImageBitmap object.

### `OC.currentBlob`
Type: function

Arguments: 

{object} `options`: an object containing the options, see [https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob) 

{function} `callback`: an callback to handle the promise

Return: A `Promise` returning a Blob object if a callback is not specified, else `undefined`.

Create a Blob object representing the image contained in the canvas

### `OC.currentCanvas`

Type: function

Argument: none

Return: The OffscreenCanvas Object

Return the transferable OffscreenCanvas object.

### `OC.loadCanvas`

Type: function

Argument:

{OffscreenCanvas} `comingCanvas`

Load a transferable OffscreenCanvas object. This action will create a new renderer if the loaded canvas' drawing context is different from the current one. Else the drawing context properties (e.g. fill and stroke color in 2d context) are also loaded. This action will not copy the OffscreenCanvas object.

