import React from "react"
import { flames, strafe_defs } from "./bitmaps"

const Draw = () => {
  const canvasEl = React.useRef(null)
  const [bitmap, setBitmap] = React.useState(null)

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

  const unpackBytes = (intArray, bytePtr, length) => {
    let unpackedBytes = []
    while (unpackedBytes.length < length) {
      let code = intArray[bytePtr]
      bytePtr++
      if (code < 128) {
        let newPtr = bytePtr + code + 1
        intArray.slice(bytePtr, newPtr).map(byte => unpackedBytes.push(byte))
        bytePtr = newPtr
      }
      if (code > 128) {
        for (let i = 0; i < 257 - code; i++) {
          unpackedBytes.push(intArray[bytePtr])
        }
        bytePtr++
      }
    }
    return {
      bytePtr: bytePtr,
      unpackedArray: new Uint8Array(unpackedBytes)
    }
  }

  const handleMacPaint = arraybuffer => {
    const lines = 720
    const packedBytes = new Uint8Array(arraybuffer.slice(512))
    const unpackedBytes = new Uint8Array(lines * 72)
    let bytePtr = 0
    for (let line = 0; line < lines; line++) {
      let unpackedObj = unpackBytes(packedBytes, bytePtr, 72)
      bytePtr = unpackedObj.bytePtr
      unpackedBytes.set(unpackedObj.unpackedArray, line * 72)
    }
    return unpackedBytes
  }

  function handleXHR() {
    setBitmap(handleMacPaint(this.response))
  }

  const handleFileUploaded = file => {
    let fileReader = new FileReader()
    fileReader.onloadend = handleFileLoaded
    fileReader.readAsArrayBuffer(file)
  }

  function handleFileLoaded() {
    const blob = this.result
    setBitmap(new Uint8Array(720 * 72))
    setBitmap(handleMacPaint(blob))
  }

  React.useEffect(() => {
    const galaxy_loc = process.env.PUBLIC_URL + "/gwfig.bin"
    const xhr = new XMLHttpRequest()
    xhr.onload = handleXHR
    xhr.open("GET", galaxy_loc, true)
    xhr.responseType = "arraybuffer"
    xhr.send()
  }, [])

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

  React.useEffect(() => {
    const ctx = canvasEl.current.getContext("2d")

    if (bitmap) {
      const pictBits = new Uint8ClampedArray(bitmap.buffer)
      let pictData = bytesToImageData(pictBits)
      const pictImageData = ctx.createImageData(576, 720)
      pictImageData.data.set(pictData)
      ctx.putImageData(pictImageData, 100, 300)
    }
  }, [bitmap])

  return (
    <div>
      <form className="bitmap-upload">
        <input
          type="file"
          onChange={e => handleFileUploaded(e.target.files[0])}
        />
      </form>
      <canvas ref={canvasEl} width="600" height="1200" />
    </div>
  )
}

export default Draw
