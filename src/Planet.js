import React from "react"
import GW from "./GW"

const Planet = () => {
  const canvasEl = React.useRef(null)
  const galaxyRef = React.useRef(null)
  const indexRef = React.useRef(null)

  const [currLevel, setCurrLevel] = React.useState(0)
  const [showError, setShowError] = React.useState(false)
  const [errorText, setErrorText] = React.useState("")
  const [numPlanets, setNumPlanets] = React.useState(0)
  const [demoPlanet, setDemoPlanet] = React.useState(0)
  const [showControls, setShowControls] = React.useState(false)
  const [canvasHeight, setCanvasHeight] = React.useState(0)
  const [canvasWidth, setCanvasWidth] = React.useState(0)

  React.useEffect(() => {
    if (galaxyRef.current !== null && indexRef.current !== null) {
      selectAndDrawPlanet()
    } else {
      setErrorText("You need to load a galaxy file")
      setShowError(true)
    }
  }, [currLevel, canvasWidth, canvasHeight])

  const ylength = [0, 2, 2, 2, 1, 0] //basically a rough table that looks up 2xsin
  const xlength = [0, 0, 1, 2, 2, 2] //basically a rough table that looks up 2xcos

  const handleNext = e => {
    e.preventDefault()
    if (currLevel < numPlanets) setCurrLevel(prevLevel => prevLevel + 1)
  }

  const handlePrev = e => {
    e.preventDefault()
    if (currLevel > 1) setCurrLevel(prevLevel => prevLevel - 1)
  }

  const selectAndDrawPlanet = () => {
    const planet = getPlanet(galaxyRef.current, indexRef.current, currLevel)
    setCanvasWidth(planet.worldwidth)
    setCanvasHeight(planet.worldheight)
    drawPlanet(planet)
    console.log(planet)
  }

  const drawPlanet = ({ lines, worldwidth, worldheight }) => {
    const ctx = canvasEl.current.getContext("2d")
    ctx.save()
    ctx.fillStyle = "#000"
    ctx.beginPath()
    ctx.fillRect(0, 0, worldwidth, worldheight)
    ctx.strokeStyle = "#FFF"
    ctx.lineWidth = 2
    //    lines.map(line => {
    //      ctx.moveTo(line.startx, line.starty)
    //      ctx.lineTo(line.endx, line.endy)
    //    })
    for (let line of lines) {
      if (line.startx === 10000) break
      ctx.moveTo(line.startx, line.starty)
      ctx.lineTo(line.endx, line.endy)
    }
    ctx.stroke()
    ctx.restore()
  }

  // Header structure:
  // first word (2 bytes) = ffef i.e. -17 in 2s complement
  // second word = number of planets
  // third word = the "cartoon", i.e., demo,  planet
  // fourth word = nothing?
  // fifth word = nothing?
  // sixth word = start of index
  // index is 150 chars/bytes, aka, 75 words
  // so first planet should start at 80th word/160th byte
  // planets are indexed, so the first planet in the file isn't
  // necessarilty the first level.  to find the first level you go
  // into the first char in the index and use that as an offset using
  // the PLANSIZE variable

  const readPlanetsHeader = galaxy => {
    if (galaxy[0] !== 255 && galaxy[1] !== 239) {
      setErrorText("Not a valid galaxy file")
      setShowError(true)
    } else {
      setNumPlanets(galaxy[3])
      setDemoPlanet(galaxy[5])
      const index = galaxy.slice(10, 10 + galaxy[3])
      indexRef.current = index
      galaxyRef.current = galaxy
      setShowError(false)
      setShowControls(true)
      setCurrLevel(1)
    }
  }

  const getPlanet = (galaxy, index, level) => {
    const planetStart =
      GW.planetFile.FILEHEAD + GW.planetFile.PLANSIZE * index[level - 1]
    // get the planet bit as a dataview as each attribute is stored
    // as a 16bit integer, but they are big-endian because this was
    // 68k architecture
    const planetData = new DataView(
      galaxy.slice(planetStart, planetStart + GW.planetFile.PLANSIZE).buffer
    )
    let oldIntSize = 2 //back then C ints on the mac were 2 bytes, big-endian
    let ip = 0 //like the old code, we are going to walk a pointer over the array
    let planetObj = {}
    planetObj.worldwidth = planetData.getInt16(ip, false) //get two bytes, big-endian
    planetObj.worldheight = planetData.getInt16((ip += oldIntSize), false)
    planetObj.worldwrap = planetData.getInt16((ip += oldIntSize), false)
    planetObj.shootslow = planetData.getInt16((ip += oldIntSize), false)
    planetObj.xstart = planetData.getInt16((ip += oldIntSize), false)
    planetObj.xstart %= planetObj.worldwidth
    planetObj.ystart = planetData.getInt16((ip += oldIntSize), false)
    planetObj.planetbonus = planetData.getInt16((ip += oldIntSize), false)
    planetObj.gravx = planetData.getInt16((ip += oldIntSize), false)
    planetObj.gravy = planetData.getInt16((ip += oldIntSize), false)
    planetObj.numcraters = planetData.getInt16((ip += oldIntSize), false)

    ip = GW.planetFile.PLANHEAD - oldIntSize
    planetObj.lines = []
    let i
    for (i = 0; i < GW.game.NUMLINES; i++) {
      let line = {
        startx: planetData.getInt16((ip += oldIntSize), false), //left endpoint x
        starty: planetData.getInt16((ip += oldIntSize), false), //left endpoint y
        length: planetData.getInt16((ip += oldIntSize), false) //longest of x, y
      }
      let ud_and_t = planetData.getInt16((ip += oldIntSize), false)
      line.up_down = ud_and_t >> 8 //top eight bits - 1 for down, -1 for up
      line.type = ud_and_t & 7 //bottom 3 bits - n, nne, ne, ene, e
      line.kind = (ud_and_t & 31) >> 3 // 2 bits above bottom 3 bits - normal, bounce, ghost, explode
      if (line.type === GW.type.LINE_NNE || line.type === GW.type.LINE_ENE)
        line.length |= 1 //make length an odd number
      //rough version of pythagorean theorum using sin/cos tables above
      line.endx = line.startx + ((xlength[line.type] * line.length) >> 1)
      line.endy =
        line.starty + line.up_down * ((ylength[line.type] * line.length) >> 1)
      //convert to newtype that eliminates up/down -- before south was north, down etc
      line.newType = line.up_down === -1 ? 10 - line.type : line.type
      if (!line.type || line.endx > 4000 || line.starty > 4000)
        line.startx = 10000
      planetObj.lines.push(line)
    }
    planetObj.bunkers = []
    for (i = 0; i < GW.game.NUMBUNKERS; i++) {
      let bunker = {
        x: planetData.getInt16((ip += oldIntSize), false),
        y: planetData.getInt16((ip += oldIntSize), false),
        rot: planetData.getInt16((ip += oldIntSize), false),
        range1: planetData.getInt16((ip += oldIntSize), false),
        range2: planetData.getInt16((ip += oldIntSize), false),
        range3: planetData.getInt16((ip += oldIntSize), false),
        range4: planetData.getInt16((ip += oldIntSize), false)
      }
      planetObj.bunkers.push(bunker)
    }
    planetObj.fuels = []
    for (i = 0; i < GW.game.NUMFUELS; i++) {
      let fuel = {
        x: planetData.getInt16((ip += oldIntSize), false),
        y: planetData.getInt16((ip += oldIntSize), false)
      }
      planetObj.fuels.push(fuel)
    }

    return planetObj
  }

  let fileReader

  const handleFileLoaded = () => {
    const blob = fileReader.result
    const galaxyFile = new Uint8Array(blob)
    readPlanetsHeader(galaxyFile)
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
        <ul>
          <li>Number of Planets: {numPlanets}</li>
          <li>Demo/Cartoon Planet: {demoPlanet}</li>
        </ul>
      </form>
      {showControls && (
        <form className="select-planet">
          <input
            onChange={e => setCurrLevel(e.target.value)}
            value={currLevel}
            type="number"
            min="1"
            max={numPlanets}
          />
          <input
            type="button"
            value="<- Previous Planet"
            onClick={handlePrev}
          />
          <input type="button" value="Next Planet ->" onClick={handleNext} />
        </form>
      )}
      <canvas ref={canvasEl} width={canvasWidth} height={canvasHeight} />
    </div>
  )
}

export default Planet
