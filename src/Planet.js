/* File: Planet.js
 *
 * React script to load a Continuum "Galaxy" file, parse it using
 * the planet-parser routines and display a map of any planet from
 * that file
 *
 * Sam Davidoff - 2020
 */

import React from "react"
import { parseGalaxyFile, getPlanet } from "./planet-parser"

const Planet = () => {
  const canvasEl = React.useRef(null)
  const [currLevel, setCurrLevel] = React.useState(0)
  const [showError, setShowError] = React.useState(false)
  const [errorText, setErrorText] = React.useState("")
  const [showControls, setShowControls] = React.useState(false)
  const [canvasHeight, setCanvasHeight] = React.useState(0)
  const [canvasWidth, setCanvasWidth] = React.useState(0)
  const galaxyRef = React.useRef(null)

  React.useEffect(() => {
    if (galaxyRef.current !== null) {
      selectAndDrawPlanet()
    } else {
      setErrorText("You need to load a galaxy file")
      setShowError(true)
    }
  }, [currLevel, canvasWidth, canvasHeight])

  const handleNext = e => {
    e.preventDefault()
    if (currLevel < galaxyRef.current.numPlanets)
      setCurrLevel(prevLevel => prevLevel + 1)
  }

  const handlePrev = e => {
    e.preventDefault()
    if (currLevel > 1) setCurrLevel(prevLevel => prevLevel - 1)
  }

  const selectAndDrawPlanet = () => {
    const planet = getPlanet(
      galaxyRef.current.planetsBuffer,
      galaxyRef.current.planetsIndex,
      currLevel
    )
    setCanvasWidth(planet.worldwidth)
    setCanvasHeight(planet.worldheight)
    drawPlanet(planet)
    console.log(planet)
  }

  const drawPlanet = planet => {
    const ctx = canvasEl.current.getContext("2d")
    ctx.save()
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.fillRect(0, 0, planet.worldwidth, planet.worldheight)
    ctx.stroke()
    ctx.strokeStyle = "#FFF"
    ctx.lineWidth = 2
    for (let line of planet.lines) {
      ctx.beginPath()
      let color
      switch (line.kind) {
        case 0: //normal
          color = "white"
          break
        case 1: //bounce
          color = "green"
          break
        case 2: //ghost
          color = "gray"
          break
        case 3: //explode
          color = "red"
          break
        default:
          color = "white"
          break
      }
      ctx.strokeStyle = color
      ctx.moveTo(line.startx, line.starty)
      ctx.lineTo(line.endx, line.endy)
      ctx.stroke()
    }
    ctx.restore()
  }

  let fileReader

  const handleFileLoaded = () => {
    const blob = fileReader.result
    galaxyRef.current = parseGalaxyFile(blob)
    setCurrLevel(1)
    setShowControls(true)
    setShowError(false)
    //handle error if invalid galaxy
  }

  const handleFileUploaded = file => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileLoaded
    fileReader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <form className="planet-upload">
        <input
          type="file"
          onChange={e => handleFileUploaded(e.target.files[0])}
        />
        {showError && <div>Error: {errorText}</div>}
      </form>
      {showControls && (
        <>
          <ul>
            <li>Number of Planets: {galaxyRef.current.numPlanets}</li>
            <li>Demo/Cartoon Planet: {galaxyRef.current.demoPlanet}</li>
          </ul>
          <form className="select-planet">
            <input
              onChange={e => setCurrLevel(e.target.value)}
              value={currLevel}
              type="number"
              min="1"
              max={galaxyRef.current.numPlanets}
            />
            <input
              type="button"
              value="<- Previous Planet"
              onClick={handlePrev}
            />
            <input type="button" value="Next Planet ->" onClick={handleNext} />
          </form>
        </>
      )}
      <canvas ref={canvasEl} width={canvasWidth} height={canvasHeight} />
    </div>
  )
}

export default Planet
