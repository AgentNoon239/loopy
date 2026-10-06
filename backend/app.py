from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from arrangement import arrange_vertices_3d
from loopy import sat_to_loopy
from sat import SATProblem

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/sat_loopy")
def sat_loopy(clauses: int, variables: int, variables_per_clause: int):

    sat = SATProblem.get_random_sat(clauses, variables, variables_per_clause)
    loopy = sat_to_loopy(sat)

    vertex_positions = arrange_vertices_3d(loopy)

    result = dict(positions=vertex_positions.tolist(), **loopy.serialize())
    return result
