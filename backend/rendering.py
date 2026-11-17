import numpy as np

from graph import Graph, StyledGraph


def get_color(n: float) -> str:
    k = (n / 3.7416516451) % 3
    tupleColor = (
        int(255 * max(0, -k * (k - 2))),
        int(255 * max(0, -(k - 1) * (k - 3))),
        int(255 * max(0, -(k - 2) * (k - 4), -(k + 1) * (k - 1))),
    )
    return f"#{tupleColor[0]:02x}{tupleColor[1]:02x}{tupleColor[2]:02x}"

def view_box(vertexPositions: np.ndarray, pad: float = 0.1) -> str:
    # Pad by at least half the stroke width so outer edges and line caps are not clipped
    lo = vertexPositions.min(axis=0) - pad
    size = vertexPositions.max(axis=0) + pad - lo
    return f"{lo[0]} {lo[1]} {size[0]} {size[1]}"

def render_2d(graph: Graph, vertexPositions: np.ndarray) -> str:
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{view_box(vertexPositions)}'>"
    for face in graph.faces:
        svg += f"<polygon points='{' '.join(map(str, vertexPositions[face.vertices].flatten()))}' fill='#555555' stroke='none'/>"
    for n, edge in enumerate(graph.edges):
        u, v = edge.u, edge.v
        svg += f"<line x1='{vertexPositions[u, 0]}' y1='{vertexPositions[u, 1]}' x2='{vertexPositions[v, 0]}' y2='{vertexPositions[v, 1]}' stroke='{get_color(n)}' stroke-width='0.1' />"
    return svg + "</svg>"

def render_2d_styled(graph: StyledGraph, vertexPositions: np.ndarray) -> str:
    svg = f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='{view_box(vertexPositions)}'>"
    for face in graph.faces:
        svg += f"<polygon points='{' '.join(map(str, vertexPositions[face.vertices].flatten()))}' fill='#555555' stroke='none'/>"
    for n, edge in enumerate(graph.edges):
        u, v = edge.u, edge.v
        edge_style = graph.edge_styles.get(edge,"default")
        if edge_style == "default":
            svg += f"<line x1='{vertexPositions[u, 0]}' y1='{vertexPositions[u, 1]}' x2='{vertexPositions[v, 0]}' y2='{vertexPositions[v, 1]}' stroke='#00BB00' stroke-width='0.1' />"
        elif edge_style == "filled":
            svg += f"<line x1='{vertexPositions[u, 0]}' y1='{vertexPositions[u, 1]}' x2='{vertexPositions[v, 0]}' y2='{vertexPositions[v, 1]}' stroke='#0000FF' stroke-width='0.1' />"
        elif edge_style == "dotted":
            svg += f"<line x1='{vertexPositions[u, 0]}' y1='{vertexPositions[u, 1]}' x2='{vertexPositions[v, 0]}' y2='{vertexPositions[v, 1]}' stroke='#00BB00' stroke-width='0.1' stroke-dasharray='0 0.25' stroke-linecap='round' />"
    return svg + "</svg>"
