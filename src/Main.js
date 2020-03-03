import React from "react"
//import "./Main.css"
import GW from "./GW"

function Main() {
  const canvasEl = React.useRef(null)

  return (
    <div className="Main">
      <canvas
        ref={canvasEl}
        width={GW.dimensions.SCRWTH}
        height={GW.dimensions.VIEWHT}
      />
    </div>
  )
}

export default Main
