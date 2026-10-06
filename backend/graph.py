from itertools import pairwise
from io import TextIOWrapper

class Edge:
    def __init__(self, u: int, v: int):
        if u == v:
            raise ValueError("u and v must be different")
        self.u = min(u, v)
        self.v = max(u, v)

    def __repr__(self):
        return f"Edge({self.u}, {self.v})"

    def __eq__(self, other):
        return self.u == other.u and self.v == other.v

    def __hash__(self):
        return hash((self.u, self.v))

class Face:
    def __init__(self, vertices: list[int], value: int):
        self.vertices = vertices
        self.value = value

class Graph:
    def __init__(self):
        self.vertex_count = 0
        self.edges: set[Edge] = set()
        self.faces = []

    def get_new_vertex(self):
        self.vertex_count += 1
        return self.vertex_count - 1

    def add_edge(self, u: int, v: int):
        edge = Edge(u, v)
        self.edges.add(edge)
        return edge

    def add_face(self, vertices: list[int], value: int):
        face = Face(vertices, value)
        self.faces.append(face)
        for i in pairwise(vertices + [vertices[0]]):
            self.add_edge(*i)

    def serialize(self):
        return {
            "vertex_count": self.vertex_count,
            "edges": [[e.u, e.v] for e in self.edges],
            "faces": [{"vertices": f.vertices, "value": f.value} for f in self.faces],
        }
