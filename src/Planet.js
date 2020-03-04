import React from "react"
import GW from "./GW"

const Planet = () => {
  //The original function
  //read_header()
  //{
  //	SetFPos(wfile, fsFromStart, 0L);		/* read the indexes */
  //	if (getw(wfile) != -17)
  //		ExitToShell();
  //	planets = getw(wfile);
  //	cartplanet = getw(wfile);
  //	SetFPos(wfile, fsFromStart, 10L);
  //	macread(wfile, sizeof(indexes), indexes);
  //}
  //
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

  const [galaxyState, setGalaxy] = React.useState([])
  const [showError, setShowError] = React.useState(false)
  const [errorText, setErrorText] = React.useState("")
  const [numPlanets, setNumPlanets] = React.useState(0)
  const [demoPlanet, setDemoPlanet] = React.useState(0)
  const [planetIndex, setPlanetIndex] = React.useState([])
  const [currPlanet, setCurrPlanet] = React.useState(null)

  const ylength = [0, 2, 2, 2, 1, 0] //basically a rough table that looks up 2xsin
  const xlength = [0, 0, 1, 2, 2, 2] //basically a rough table that looks up 2xcos

  const readPlanetsHeader = galaxy => {
    if (galaxy[0] !== 255 && galaxy[1] !== 239) {
      setErrorText("Not a valid galaxy file")
      setShowError(true)
    } else {
      setNumPlanets(galaxy[3])
      setDemoPlanet(galaxy[5])
      const index = galaxy.slice(10, galaxy[3])
      setPlanetIndex(index)
      getPlanet(galaxy, index, 1)
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
      line.endy = line.starty + ((ylength[line.type] * line.length) >> 1)
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

    //    let newLines = planetObj.lines.filter(line => line.startx < 10000)
    //    planetObj.lines = newLines
    setCurrPlanet(planetObj)
  }

  let fileReader

  const handleFileLoaded = () => {
    const blob = fileReader.result
    const galaxyFile = new Uint8Array(blob)
    //setGalaxy(galaxyFile) //seems to take a while....
    readPlanetsHeader(galaxyFile)
  }

  const handleFileUploaded = file => {
    fileReader = new FileReader()
    fileReader.onloadend = handleFileLoaded
    fileReader.readAsArrayBuffer(file)
  }

  return (
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
  )
}

export default Planet
