type Edge = [number, number] // [u, v] where u < v

type Face = {
  vertices: number[]
  value: number
}

export class Loopy {
  vertexCount: number
  edges: Edge[]
  faces: Face[]
  solution: Edge[]

  constructor(vertexCount: number, edges: Edge[], faces: Face[]) {
    this.vertexCount = vertexCount
    this.edges = edges
    this.faces = faces
    this.solution = []
  }

  addSolutionEdge(edge: Edge) {
    this.solution.push(edge)
  }

  removeSolutionEdge(edge: Edge) {
    this.solution = this.solution.filter(e => e[0] !== edge[0] || e[1] !== edge[1])
  }

  solutionHasEdge(edge: Edge): boolean {
    return this.solution.some(e => e[0] === edge[0] && e[1] === edge[1])
  }

  _validateLoop(): boolean {
    const solutionCopy = [...this.solution]

    let edge = solutionCopy.pop()
    if (edge === undefined) return false
    let [start, current] = edge

    while (solutionCopy.length > 1) {
      const nextIndex = solutionCopy.findIndex((edge: Edge) => edge[0] === current || edge[1] === current)
      if (nextIndex === -1) return false
      current = solutionCopy[nextIndex][0] === current ? solutionCopy[nextIndex][1] : solutionCopy[nextIndex][0]
      solutionCopy.splice(nextIndex, 1)
    }
    return (solutionCopy[0][0] === Math.min(start, current) && solutionCopy[0][1] === Math.max(start, current))
  }

  _validateFaces(): boolean {
    return this.faces.every(face => {
      return this.edges.filter(edge => face.vertices.includes(edge[0]) && face.vertices.includes(edge[1])).length === face.vertices.length
    })
  }

  validateSolution(): boolean {
    return this._validateLoop() && this._validateFaces()
  }
}
