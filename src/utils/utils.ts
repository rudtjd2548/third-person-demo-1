export const randomNumBetween = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

export const randomIntBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const dtr = (deg: number) => {
  return (Math.PI / 180) * deg
}

export function findKeyWithWord(obj: any, word: string): any {
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && key.includes(word)) {
      return key
    }
  }
  return null
}
