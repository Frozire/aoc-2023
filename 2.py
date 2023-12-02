from collections import Counter
from functools import reduce
from operator import mul, or_

game_data = []

def parse_game_data(game):
    game_id, draws_str = game.strip().split(": ")
    game_id = int(game_id.split(" ")[1])
    draws = [[c.split(" ") for c in d.split(", ")] for d in draws_str.split("; ")]
    return game_id, [Counter({color: int(count) for count, color in draw}) for draw in draws]

def is_subset(counter1, counter2):
    return all(counter1[key] <= counter2.get(key, 0) for key in counter1)

thresholds = Counter({"red": 12, "green": 13, "blue": 14})

total_feasible_ids = 0
total_minimum_cubes_product = 0

for game in example_data:
    game_id, draws = parse_game_data(game)
    total_feasible_ids += all(is_subset(d, thresholds) for d in draws) * game_id
    total_minimum_cubes_product += reduce(mul, reduce(or_, draws).values())

print("Total Feasible Game IDs:", total_feasible_ids)
print("Total Minimum Cubes Product:", total_minimum_cubes_product)
