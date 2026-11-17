from graph import StyledGraph
from rendering import render_2d
from arrangement import arrange_vertices_2d

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
g.add_face([2,3,5,6],2)
g.vertex_count = 12

with open("../presentation/uniqueness_pic_pre.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

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
g.add_edge(19,18,"dotted")
g.add_edge(20,18, "dotted")
g.vertex_count = 21

with open("../presentation/clause_gadget.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

g = StyledGraph()
g.add_face(list(range(4)),1)
g.add_face(list(range(4,8)),1)
g.add_edge(0,9,"dotted")
g.add_edge(1,5,"dotted")
g.add_edge(3,7,"dotted")
g.add_edge(8,10,"dotted")
g.vertex_count = 11

with open("../presentation/variable_gadget.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

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

with open("../presentation/non_unique.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

g = StyledGraph()
g.add_face(list(range(6)),1)
g.add_edge(6,0)
g.add_edge(7,1)
g.add_edge(6,7)
g.add_edge(6,8,"dotted")
g.add_edge(7,9,"dotted")
g.add_edge(10,4,"dotted")
g.add_edge(11,3,"dotted")
g.vertex_count = 14

with open("../presentation/2-or-unqiue.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

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
g.vertex_count = 21

with open("../presentation/naive-3-or.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))

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
g.vertex_count = 21

with open("../presentation/true-3-or.svg","w") as f:
    f.write(render_2d(g,arrange_vertices_2d(g)))
