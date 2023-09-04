import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'

const ktx2Loader = new KTX2Loader()
ktx2Loader.setTranscoderPath(`/static/lib/basis/`) //basis_transcoder.js

export function getKtx2Loader(renderer: any) {
  renderer && ktx2Loader.detectSupport(renderer)
  return ktx2Loader
}

export const randomNumBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const dtr = (deg: number) => {
  return (Math.PI / 180) * deg
}

export const lerp = (start: number, end: number, lerp: number) => {
  return start + (end - start) * lerp
}

export function debounce(func: Function, wait: number, immediate: boolean): Function {
  let timeout: number | null | any;

  return function executedFunction(this: any, ...args: any[]) {
    const context = this;

    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

export function rLerp(A: number, B: number, w: number){
  let CS = (1-w)*Math.cos(A) + w*Math.cos(B);
  let SN = (1-w)*Math.sin(A) + w*Math.sin(B);
  return Math.atan2(SN,CS);
}
