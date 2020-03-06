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
import { getBunkerAngles } from "./draw_helper"

const Planet = () => {
  const canvasEl = React.useRef(null)
  const [currLevel, setCurrLevel] = React.useState(0)
  const [showControls, setShowControls] = React.useState(false)
  const [canvasHeight, setCanvasHeight] = React.useState(0)
  const [canvasWidth, setCanvasWidth] = React.useState(0)
  const galaxyRef = React.useRef(null)

  const galaxyLoaded = arrayBuffer => {
    galaxyRef.current = parseGalaxyFile(arrayBuffer)
    setCanvasWidth(0)
    setCurrLevel(1)
    setShowControls(true)
    //handle error if invalid galaxy
  }

  const handleFileUploaded = file => {
    let fileReader = new FileReader()
    fileReader.onloadend = handleFileLoaded
    fileReader.readAsArrayBuffer(file)
  }

  function handleXHR() {
    galaxyLoaded(this.response)
  }

  function handleFileLoaded() {
    const blob = this.result
    galaxyLoaded(blob)
  }

  React.useEffect(() => {
    const galaxy_loc = process.env.PUBLIC_URL + "/orig_galaxy.bin"
    const xhr = new XMLHttpRequest()
    xhr.onload = handleXHR
    xhr.open("GET", galaxy_loc, true)
    xhr.responseType = "arraybuffer"
    xhr.send()
  }, [])

  React.useEffect(() => {
    if (galaxyRef.current !== null) {
      selectAndDrawPlanet()
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
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.fillRect(0, 0, planet.worldwidth, planet.worldheight)
    ctx.stroke()
    drawLines(ctx, planet.lines)
    drawBunkers(ctx, planet.bunkers)
    drawFuels(ctx, planet.fuels)
    drawCraters(ctx, planet.craters)
  }

  const drawLines = (ctx, lines) => {
    ctx.save()
    ctx.lineWidth = 1
    for (let line of lines) {
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

  const drawBunkers = (ctx, bunkers) => {
    ctx.save()
    ctx.lineWidth = 1
    bunkers.map(bunker => {
      let color
      switch (bunker.kind) {
        case 0: //normal sit-on-wall bunker
          color = "red"
          break
        case 1: //different at each orientation
          color = "pink"
          break
        case 2: //normal sit-on-ground bunker
          color = "orange"
          break
        case 3: //tracking bunker
          color = "purple"
          break
        case 4: //generator bunker
          color = "gray"
          break
        default:
          color = "white"
          break
      }
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(bunker.x, bunker.y, 24, 0, 2 * Math.PI)
      ctx.stroke()
      if ([0, 2, 3].indexOf(bunker.kind) !== -1) {
        //only the bunkers with guns
        //this isn't quite right as bunker 1 has guns in certain
        //rotations.  need to fix
        for (let j = 0; j < 2; j++) {
          let angles = getBunkerAngles(
            bunker.ranges[j].low,
            bunker.ranges[j].high,
            bunker.kind,
            bunker.rot
          )
          ctx.beginPath()
          ctx.arc(
            bunker.x,
            bunker.y,
            50 - 10 * j,
            1.5 * Math.PI + (angles.start * Math.PI) / 180,
            1.5 * Math.PI + (angles.end * Math.PI) / 180
          )
          ctx.stroke()
        }
      }
    })
    ctx.restore()
  }

  const drawFuels = (ctx, fuels) => {
    ctx.save()
    ctx.lineWidth = 1
    ctx.fillStyle = "white"
    fuels.map(fuel => {
      ctx.beginPath()
      ctx.arc(fuel.x, fuel.y, 12, 0, 2 * Math.PI)
      ctx.fill()
    })
    ctx.restore()
  }

  const drawCraters = (ctx, craters) => {
    ctx.save()
    ctx.lineWidth = 1
    ctx.fillStyle = "gray"
    craters.map(crater => {
      ctx.beginPath()
      ctx.arc(crater.x, crater.y, 6, 0, 2 * Math.PI)
      ctx.fill()
    })
    ctx.restore()
  }

  return (
    <div>
      <form className="planet-upload">
        <input
          type="file"
          onChange={e => handleFileUploaded(e.target.files[0])}
        />
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
