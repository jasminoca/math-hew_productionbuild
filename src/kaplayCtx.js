import kaplay from "kaplay";

let kInstance = null;

export default function initKaplay(rootElement) {
  if (!kInstance) {
    kInstance = kaplay({
      root: rootElement, // ✅ Attach to your custom game container
      global: false,
      width: 256,
      height: 224,
      letterbox: true,
      touchToMouse: true,
      scale: 1,
      pixelDensity: devicePixelRatio,
      debug: false,
    });
  }

  return kInstance;
}
