import './style.css'
import { render } from './renderer.ts'
import { Loopy } from './loopy.ts'
import type { Vector3 } from './vector.ts'
import type { CameraPosition } from './camera.ts'

let cameraPosition: CameraPosition = {
  latitude: 0,
  longitude: 0,
  distance: 6
}

document.body.addEventListener("keypress", (e) => {
  if (e.key == "a") {
    cameraPosition.longitude += 0.1
  } else if (e.key == "d") {
    cameraPosition.longitude -= 0.1
  } else if (e.key == "w") {
    cameraPosition.latitude += 0.1
  } else if (e.key == "s") {
    cameraPosition.latitude -= 0.1
  } else if (e.key == "h") {
    cameraPosition.distance -= 1
  } else if (e.key == "n") {
    cameraPosition.distance += 1
  }
  render(...loopy, document.querySelector("canvas")!, cameraPosition)
})

function resize() {
  const canvas = document.querySelector("canvas")!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

let loopy: [Loopy, Vector3[]];

fetch("https://loopy-worker.tomgmaldenmail.workers.dev/sat_loopy?clauses=5&variables=5&variables_per_clause=3")
  .then(response => response.json())
  .then(data => {
    loopy = [new Loopy(data.vertexCount, data.edges, data.faces), data.positions]
    resize()
    render(...loopy, document.querySelector("canvas")!, cameraPosition)
    window.addEventListener("resize", () => {
      resize()
      render(...loopy, document.querySelector("canvas")!, cameraPosition)
    })
  })
