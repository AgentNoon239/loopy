export type Vector = number[]
export type Vector2 = [number, number]
export type Vector3 = [number, number, number]

export function vectorAdd<T extends Vector>(a: T, b: T): T {
    return a.map((v, i) => v + b[i]) as T
}

export function vectorSubtract<T extends Vector>(a: T, b: T): T {
    return a.map((v, i) => v - b[i]) as T
}

export function vectorScale<T extends Vector>(a: T, scalar: number): T {
    return a.map(v => v * scalar) as T
}

export function vectorDot<T extends Vector>(a: T, b: T): number {
    return a.reduce((acc, v, i) => acc + v * b[i], 0)
}

export function vectorPerpendicular(v: Vector3): Vector3 {
  const [x, y, z] = v
  // pick the axis with the smallest |component|
  if (Math.abs(x) <= Math.abs(y) && Math.abs(x) <= Math.abs(z)) {
      return [0, -z, y]      // cross with x-axis
  } else if (Math.abs(y) <= Math.abs(z)) {
      return [-z, 0, x]      // cross with y-axis
  } else {
      return [-y, x, 0]      // cross with z-axis
  }
}

export function vectorCross(v1: Vector3, v2: Vector3): Vector3 {
  const [x1, y1, z1] = v1
  const [x2, y2, z2] = v2
  return [
    y1 * z2 - z1 * y2,
    z1 * x2 - x1 * z2,
    x1 * y2 - y1 * x2,
  ]
}

export function vectorLength(v: Vector): number {
  return Math.hypot(...v)
}

export function vectorNormalize<T extends Vector>(v: T): T {
  const len = vectorLength(v)
  return v.map(v => v / len) as T
}
