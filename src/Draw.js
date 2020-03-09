import React from "react"
import { flames, strafe_defs } from "./bitmaps"

const Draw = () => {
  const canvasEl = React.useRef(null)

  const insertBackground = (bytes, rev) => {
    for (let x = 0; x < bytes.length; x += 2) {
      bytes[x] ^= rev ? 85 : 170
      if (bytes[x + 1]) bytes[x + 1] ^= rev ? 170 : 85
    }
    return bytes
  }

  const blackPixel = bArray => {
    bArray.push(0)
    bArray.push(0)
    bArray.push(0)
    bArray.push(255)
    return bArray
  }
  const whitePixel = bArray => {
    bArray.push(255)
    bArray.push(255)
    bArray.push(255)
    bArray.push(255)
    return bArray
  }
  const byteToPixels = (byte, bArray) => {
    for (let x = 0; x < 8; x++) {
      let bit = byte >>> x
      bit &= 1
      bArray = bit === 1 ? blackPixel(bArray) : whitePixel(bArray)
    }
    return bArray
  }
  const bytesToImageData = bytes => {
    let bArray = []
    for (let byte of bytes) {
      bArray = byteToPixels(byte, bArray)
    }
    return new Uint8ClampedArray(bArray)
  }

  React.useEffect(() => {
    const ctx = canvasEl.current.getContext("2d")

    let newFlames = insertBackground(flames)
    const flameBits = new Uint8ClampedArray(newFlames)
    let flameData = bytesToImageData(flameBits)
    const flamesImageData = ctx.createImageData(8, 256)
    flamesImageData.data.set(flameData)
    ctx.putImageData(flamesImageData, 100, 100)

    const strafeBits = new Uint8ClampedArray(strafe_defs)
    let strafeData = bytesToImageData(strafeBits)
    const strafeImageData = ctx.createImageData(8, 128)
    strafeImageData.data.set(strafeData)
    ctx.putImageData(strafeImageData, 150, 150)
  }, [])

  return (
    <div>
      <canvas ref={canvasEl} width="600" height="600" />
    </div>
  )
}

export default Draw
