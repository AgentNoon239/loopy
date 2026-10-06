from itertools import pairwise

from arrangement import arrange_vertices_2d, arrange_vertices_3d
from graph import Edge, Graph
from rendering import render_2d
from sat import SATProblem


def sat_to_loopy(sat: SATProblem):
    graph = Graph()
    clause_polygons = []
    edges_for_literals: dict[int, list[Edge]] = {}

    for clause in sat.clauses:
        vertices = [graph.get_new_vertex() for _ in range(len(clause) * 2)]
        edges = [graph.add_edge(i, j) for i, j in pairwise(vertices)]
        graph.add_edge(vertices[-1], vertices[0])

        clause_polygons.append(graph.add_face(vertices, 1))

        for literal, edge in zip(clause, edges[::2]):
            if literal not in edges_for_literals:
                edges_for_literals[literal] = []
            edges_for_literals[literal].append(edge)

    chain_vertices = [graph.get_new_vertex() for _ in sat.variables]

    for n, variable in enumerate(sat.variables):
        start_splitter_vertices = [chain_vertices[n]] + [
            graph.get_new_vertex() for _ in range(3)
        ]
        end_splitter_vertices = [chain_vertices[(n + 1) % len(chain_vertices)]] + [
            graph.get_new_vertex() for _ in range(3)
        ]

        graph.add_face(start_splitter_vertices, 1)
        graph.add_face(end_splitter_vertices, 1)

        create_literal_spokes(
            graph,
            edges_for_literals.get(variable, []),
            start_splitter_vertices[1],
            end_splitter_vertices[1],
        )
        create_literal_spokes(
            graph,
            edges_for_literals.get(-variable, []),
            start_splitter_vertices[3],
            end_splitter_vertices[3],
        )

    return graph


def create_literal_spokes(
    graph: Graph, edges_to_connect: list[Edge], start: int, end: int
):
    current_required_vertex = start
    len_edges_to_connect = len(edges_to_connect)
    for n, edge in enumerate(edges_to_connect):
        if n > 0:
            new_required_vertex = graph.get_new_vertex()
            graph.add_edge(current_required_vertex, new_required_vertex)
            current_required_vertex = new_required_vertex
        graph.add_edge(current_required_vertex, edge.u)
        if n < len_edges_to_connect - 1:
            new_required_vertex = graph.get_new_vertex()
        else:
            new_required_vertex = end
        graph.add_edge(current_required_vertex, new_required_vertex)
        graph.add_edge(edge.v, new_required_vertex)
        current_required_vertex = new_required_vertex


def export_3d(graph):
    with open("loopy.obj", "w") as f:
        arranged_vertices = arrange_vertices_3d(graph)
        f.writelines(f"v {x} {y} {z}\n" for x, y, z in arranged_vertices)
        f.writelines(f"l {edges.u + 1} {edges.v + 1}\n" for edges in graph.edges)
        f.writelines(
            f"f {' '.join(str(v + 1) for v in face.vertices)}\n" for face in graph.faces
        )


def export_2d(graph):
    with open("loopy.svg", "w") as f:
        arranged_vertices = arrange_vertices_2d(graph)
        f.write(render_2d(graph, arranged_vertices))


# sat = SATProblem([{1, 2, 3}, {-1, -2, -3}, {1, -2, 3}, {4, 2, 1}, {-3, -4, -2}])
# graph = sat_to_loopy(sat)
# export_3d(graph)
