from graph import StyledGraph
from rendering import render_2d_styled
from arrangement import arrange_vertices_2d
import os

def render(g: StyledGraph, path: str):
    full_path = f"../presentation/images/{path}.svg"
    if os.path.exists(full_path):
        print("Path", full_path, "already exists. Skipping")
    else:
        with open(full_path,"w") as f:
            f.write(render_2d_styled(g,arrange_vertices_2d(g)))

g = StyledGraph()
g.add_edge(1,2)
g.add_edge(2,3)
g.add_edge(4,5)
g.add_edge(5,6)
g.add_edge(1,4)
g.add_edge(2,5)
g.add_edge(3,6)
g.add_edge(0,1, "filled")
g.add_edge(10,0, "dotted")
g.add_edge(7,6, "dotted")
g.add_edge(8,6, "filled")
g.add_edge(8,11, "dotted")
g.add_edge(9,3, "dotted")
g.add_face([2,3,6,5],2)
g.vertex_count = 12

render(g, "uniqueness_counterexample")

g = StyledGraph()
g.add_face(list(range(9)),1)
g.add_edge(0,9)
g.add_edge(1,10)
g.add_edge(9,10)
g.add_edge(11,9,"dotted")
g.add_edge(12,10, "dotted")
g.add_edge(3,13)
g.add_edge(4,14)
g.add_edge(13,14)
g.add_edge(15,13,"dotted")
g.add_edge(16,14, "dotted")
g.add_edge(6,17)
g.add_edge(7,18)
g.add_edge(17,18)
g.add_edge(19,17,"dotted")
g.add_edge(20,18, "dotted")
g.vertex_count = 21

render(g, "clause_gadget")

g = StyledGraph()
g.add_face(list(range(4)),1)
g.add_face(list(range(4,8)),1)
g.add_edge(0,8,"dotted")
g.add_edge(1,5,"dotted")
g.add_edge(3,7,"dotted")
g.add_edge(6,9,"dotted")
g.vertex_count = 10

render(g, "variable_gadget")

g = StyledGraph()
g.add_face(list(range(6)),1)
g.add_edge(6,0)
g.add_edge(7,1)
g.add_edge(6,7)
g.add_edge(6,8,"dotted")
g.add_edge(7,9,"dotted")
g.add_edge(10,4)
g.add_edge(11,3)
g.add_edge(10,11)
g.add_edge(10,12,"dotted")
g.add_edge(11,13,"dotted")
g.vertex_count = 14

render(g, "non_unique")

g = StyledGraph()
g.add_face(list(range(6)),1)
g.add_edge(6,0)
g.add_edge(7,1)
g.add_edge(6,7)
g.add_edge(6,8,"dotted")
g.add_edge(7,9,"dotted")
g.add_edge(10,4,"dotted")
g.add_edge(11,3,"dotted")
g.vertex_count = 12

render(g, "2-or-unique")

g = StyledGraph()
g.add_face(list(range(9)),1)
g.add_edge(0,9)
g.add_edge(1,10)
g.add_edge(9,10)
g.add_edge(11,9,"dotted")
g.add_edge(12,10, "dotted")
g.add_edge(3,13)
g.add_edge(4,14)
g.add_edge(13,14)
g.add_edge(15,13,"dotted")
g.add_edge(16,14, "dotted")
g.add_edge(6,17, "dotted")
g.add_edge(7,18, "dotted")
g.vertex_count = 19

render(g,"naive-3-or")

g = StyledGraph()
g.add_face(list(range(9)),1)
g.add_face(list(range(8,14)),1)
# 1st
g.add_edge(2,14,"dotted")
g.add_edge(3,15,"dotted")
# 2nd
g.add_edge(5,16)
g.add_edge(16,17,"dotted")
g.add_edge(16,13) # New cross edge
g.add_edge(6,18)
g.add_edge(18,19,"dotted")
g.add_edge(18,12)
#3rd
g.add_edge(9,20,"dotted")
g.add_edge(9,21)
g.add_edge(0,21)
g.add_edge(21,22,"dotted")
# always on
g.add_edge(10,23)
g.add_edge(11,24)
g.add_edge(23,24)
# always on enters
g.add_edge(23,25, "filled")
g.add_edge(24,26, "filled")
g.vertex_count = 27

render(g,"true-3-or")
