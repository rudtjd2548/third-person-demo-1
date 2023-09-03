import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'

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
