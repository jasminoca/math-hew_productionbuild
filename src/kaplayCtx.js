
import kaplay from "kaplay";

const k = kaplay({
    global: false,
    width: 256,
    height: 224,
    letterbox: true,
    touchToMouse: true,
    scale: 2,
    pixelDensity: devicePixelRatio,
    debug: false,
  });

export default k;
  
