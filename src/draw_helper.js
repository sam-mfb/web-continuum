//Routine to set where the bunker starts drawing its bitmap from.  The
//center lookup table is hardcoded in Continuum's Figs.c file and the
//calculation comes from Bunkers.c
const getBunkerStartXY = (x, y, kind, rot) => {
  const xbcenter = {
    0: [24, 24, 24, 23, 22, 22, 22, 24, 24, 24, 24, 25, 26, 26, 26, 24],
    1: [25, 22, 21, 14, 10, 13, 18, 22, 23, 26, 27, 34, 38, 35, 30, 26],
    2: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
    3: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
    4: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]
  }
  const ybcenter = {
    0: [26, 26, 26, 24, 24, 24, 24, 23, 22, 22, 22, 24, 24, 24, 24, 25],
    1: [38, 35, 30, 26, 25, 22, 21, 14, 10, 13, 18, 22, 23, 26, 27, 34],
    2: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
    3: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
    4: [24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]
  }

  return {
    x: x - xbcenter[kind][rot],
    y: y - ybcenter[kind][rot]
  }
}

const getBunkerAngles = (low, high, kind, rot) => {
  return {
    start: (low * 360) / 512,
    end: (high * 360) / 512
  }
}

export { getBunkerStartXY, getBunkerAngles }
