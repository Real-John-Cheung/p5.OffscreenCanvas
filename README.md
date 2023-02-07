# p5.OffscreenCanvas
A library for manipulating OffscreenCanvas with p5

## Useage
Download the `p5.OffscreenCanvas.js` file and put it in your project

<b>Important</b> it should be loaded after p5, your `index.html` file should look something like this
```
...
<script src="path/to/p5"></script>
<script src="path/to/p5.OffscreenCanvas"></script>
<script src="path/to/sketch"></script>
...
```

This little wrapper provides a new function `createOffscreenCanvas`, which return a `p5.Graphics`-like object. It can be used to draw things off screen with the `OffscreenCanvas` Object instead of creating a new `canvas` in the dom tree. See files in the `example` folder for more information 

## Todo

Make it work with `Worker` on another thread
