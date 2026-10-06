import numpy as np

from graph import Graph


def get_color(n: float) -> str:
    k = (n / 3.7416516451) % 3
    tupleColor = (
        int(255 * max(0, -k * (k - 2))),
        int(255 * max(0, -(k - 1) * (k - 3))),
        int(255 * max(0, -(k - 2) * (k - 4), -(k + 1) * (k - 1))),
    )
    return f"#{tupleColor[0]:02x}{tupleColor[1]:02x}{tupleColor[2]:02x}"

def render_2d(graph: Graph, vertexPositions: np.ndarray) -> str:
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{" ".join(map(str, vertexPositions.min(axis=0)))} {' '.join(map(str, vertexPositions.max(axis=0) - vertexPositions.min(axis=0)))}'>"
    for face in graph.faces:
        svg += f"<polygon points='{' '.join(map(str, vertexPositions[face.vertices].flatten()))}' fill='#555555' stroke='none'/>"
    for n, edge in enumerate(graph.edges):
        u, v = edge.u, edge.v
        svg += f"<line x1='{vertexPositions[u, 0]}' y1='{vertexPositions[u, 1]}' x2='{vertexPositions[v, 0]}' y2='{vertexPositions[v, 1]}' stroke='{get_color(n)}' stroke-width='0.1' />"
    return svg + "</svg>"
