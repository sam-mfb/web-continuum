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

  const [showError, setShowError] = React.useState(false)
  const [errorText, setErrorText] = React.useState("")
  const [numPlanets, setNumPlanets] = React.useState(0)
  const [demoPlanet, setDemoPlanet] = React.useState(0)
  const [planetIndex, setPlanetIndex] = React.useState([])

  const readPlanetsHeader = galaxyFile => {
    if (galaxyFile[0] !== 255 && galaxyFile[1] !== 239) {
      setErrorText("Not a valid galaxy file")
      setShowError(true)
    } else {
      setNumPlanets(galaxyFile[3])
      setDemoPlanet(galaxyFile[5])
      setPlanetIndex(galaxyFile.slice(10, numPlanets))
    }
  }

  const getPlanet = (index, level) => {
    const planetStart =
      GW.planetFile.FILEHEAD + GW.planetFile.PLANSIZE * index[level - 1]
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
