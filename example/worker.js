onmessage = (event) => {
    const oc = event.canvas;
    const ty = event.ty;
    if (ty) {
        oc.background(200);
        oc.blendMode(BURN);
        oc.noStroke();
        oc.fill(255, 0, 0);
        oc.rect(40, 40, 50);
        oc.fill(0, 255, 0);
        oc.rect(60, 60, 50);
    } else {
        oc.fill(100);
        oc.rect(-50, -50, 100);
        oc.fill(255);
        oc.ellipse(10, 10, 10);
        oc.rectMode(CENTER);
        oc.rect(30, 10, 10);
        oc.rotateX(PI / 4);
        oc.rotateZ(PI / 4);
        oc.box(10, 10, 10);
    }
}