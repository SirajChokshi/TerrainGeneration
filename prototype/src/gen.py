import numpy as np
from noise import snoise2

X_POS = -5
Y_POS = 0
BLOCK = '\u2588\u2588'
WATER_LEVEL = 2
COMPLEXITY = 20

class colors:
	HEADER = '\033[95;1m'
	DEEP_BLUE = '\033[94m'
	BLUE = '\u001b[36m'
	GREEN = '\033[92m'
	DARK_GREEN = '\u001b[32;1m'
	ORANGE = '\033[93m'
	RED = '\u001b[31;1m'
	RESET = '\u001b[0m'
	GREY = '\u001b[30;1m'
	WHITE = '\u001b[37m'

def create_map(SEED, SCALE=2):
	value = np.zeros((30,30))
	height = len(value[0])
	width = len(value)
	octaves = 1
	persistence = 0.5
	lacunarity = 2.0
	
	for y in range(height):
		for x in range(width):
			nx = ((x + X_POS)/width)
			ny = ((y + Y_POS)/height)
			value[y][x] = snoise2(nx * SCALE, ny * SCALE,
								octaves=octaves, 
					            persistence=persistence, 
					            lacunarity=lacunarity, 
					            repeatx=10, 
					            repeaty=10, 
					            base=SEED
			)
	
	temp = np.copy(value) * COMPLEXITY
	map = np.floor(temp)
	return map

def print_map(map):
	height = len(map[0])
	width = len(map)
	
	for y in range(height):
		for x in range(width):
			if map[y][x] < WATER_LEVEL:
				if (map[y][x] < WATER_LEVEL - COMPLEXITY/5.5):
					print(colors.DEEP_BLUE + BLOCK, end = '')
				else:
					print(colors.BLUE + BLOCK, end = '')
			elif map[y][x] < WATER_LEVEL + COMPLEXITY / 10 and map[y][x] > WATER_LEVEL - COMPLEXITY/20:
				print(colors.ORANGE + BLOCK, end = '')
			elif map[y][x] < WATER_LEVEL + 7:
				print(colors.GREEN + BLOCK, end = '')
			elif map[y][x] < WATER_LEVEL + 8:
				print(colors.DARK_GREEN + BLOCK + colors.RESET, end = '')
			elif map[y][x] < WATER_LEVEL + 12:
				print(colors.GREY + BLOCK, end = '')
			else:
				print(colors.WHITE + BLOCK, end = '')
		print()