/*
 File Main.js: React component loosely based on:
    
    Copyright (c) 1986-88 Randall H. Wilson
 Updated by S. Davidoff 2020
*/

import React from "react"
import GW from "./GW"
import Planet from "./Planet"

function Main() {
  const canvasEl = React.useRef(null)
  const requestRef = React.useRef()
  const zoom = 1

  const [score, setScore] = React.useState(0)
  const [fuel, setFuel] = React.useState(GW.game.FUELSTART)
  const [numships, setNumships] = React.useState(GW.game.SHIPSTART)
  const [endofgame, setEndofgame] = React.useState(false)
  const [currentlevel, setCurrentlevel] = React.useState(1)
  const [currentplanet, setCurrentplanet] = React.useState({})
  const [planetsIndex, setPlanetsIndex] = React.useState([])

  const [ball, setBall] = React.useState({ x: 0, y: 0 })
  const [ctx, setContext] = React.useState(null)
  const [velocity, setVelocity] = React.useState(2)

  const animate = () => {
    ctx.save()
    ctx.fillStyle = "#000"
    ctx.globalAlpha = 0.4
    ctx.fillRect(0, 0, GW.dimensions.SCRWTH, GW.dimensions.SCRHT)
    ctx.globalAlpha = 1

    ctx.strokeStyle = "#FFF"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, 20, 0, 2 * Math.PI)
    ctx.stroke()

    ctx.restore()
    const reverseVelocity = () => setVelocity(prevState => prevState * -1)
    if (
      (ball.x > GW.dimensions.SCRHT && velocity > 0) ||
      (ball.y > GW.dimensions.SCRWTH && velocity > 0) ||
      (ball.x < 0 && velocity < 0) ||
      (ball.y < 0 && velocity < 0)
    ) {
      reverseVelocity()
    }
    setBall(prevState => {
      return { x: prevState.x + velocity, y: prevState.y + velocity }
    })
    requestRef.current = requestAnimationFrame(animate)
  }

  React.useEffect(() => {
    const context = canvasEl.current.getContext("2d")
    setContext(context)
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [ctx, ball])

  return (
    <div className="Main">
      <canvas
        ref={canvasEl}
        width={GW.dimensions.SCRWTH * zoom}
        height={GW.dimensions.SCRHT * zoom}
      />
      <Planet />
    </div>
  )
}

export default Main
