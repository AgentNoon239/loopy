import numpy as np
from graph import Graph

max_iter = 1000

def arrange_vertices_3d(graph: Graph):
    adjacency_matrix = np.zeros((graph.vertex_count, graph.vertex_count))
    for edge in graph.edges:
        adjacency_matrix[edge.u, edge.v] = 1
        adjacency_matrix[edge.v, edge.u] = 1

    vertex_coords = np.random.rand(graph.vertex_count, 3)

    for _ in range(max_iter):
        diffs = vertex_coords.reshape(-1, 1, 3) - vertex_coords.reshape(1, -1, 3)
        dist = np.linalg.norm(diffs, axis=2)

        attraction = adjacency_matrix * dist
        replusion = (np.maximum(dist,0.001) ** -2)
        force = (-attraction + replusion).reshape(graph.vertex_count, graph.vertex_count, 1) * diffs * 0.01
        vertex_coords += force.sum(axis=1)

    return vertex_coords

def arrange_vertices_2d(graph: Graph):
    adjacency_matrix = np.zeros((graph.vertex_count, graph.vertex_count))
    for edge in graph.edges:
        adjacency_matrix[edge.u, edge.v] = 1
        adjacency_matrix[edge.v, edge.u] = 1

    vertex_coords = np.random.rand(graph.vertex_count, 2)

    for _ in range(max_iter):
        diffs = vertex_coords.reshape(-1, 1, 2) - vertex_coords.reshape(1, -1, 2)
        dist = np.linalg.norm(diffs, axis=2)

        attraction = adjacency_matrix * dist
        replusion = (np.maximum(dist,0.001) ** -2)
        force = (-attraction + replusion).reshape(graph.vertex_count, graph.vertex_count, 1) * diffs * 0.01
        vertex_coords += force.sum(axis=1)

    return vertex_coords
