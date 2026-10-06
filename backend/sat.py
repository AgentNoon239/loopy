import random


class SATProblem:
    def __init__(self, clauses: list[set[int]]):
        variables = set()
        for clause in clauses:
            if 0 in clause:
                raise ValueError("Clause cannot contain 0")
            variables.update({abs(v) for v in clause})
        self.variables = variables
        self.clauses = clauses

    def satisfies(self, assignment: dict[int, bool]) -> bool:
        for clause in self.clauses:
            if not any(assignment.get(abs(v), False) ^ (v < 0) for v in clause):
                return False
        return True

    @classmethod
    def get_random_sat(
        cls, variables: int, clauses: int, variables_per_clause: int
    ) -> "SATProblem":
        truthy = [random_sign() * (i + 1) for i in range(variables_per_clause)]
        literals = [-i for i in range(1, variables + 1)] + [
            i for i in range(1, variables + 1)
        ]
        sat = []
        for _ in range(clauses):
            clause = {random.choice(truthy)}
            while len(clause) < variables_per_clause:
                clause.add(random.choice(literals))
            sat.append(clause)

        return cls(sat)


def random_sign():
    return random.choice([-1, 1])


# print(SATProblem([{-1, -2}, {-1, 2}]).satisfies({1: False, 2: False}))
