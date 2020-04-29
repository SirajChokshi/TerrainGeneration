import sys
import random
from src import gen

def main():
	if (len(sys.argv) > 1):
		if (sys.argv[1] == '--help'):
			print(f"""
{gen.colors.HEADER}Map Generator (gen.py) Help{gen.colors.RESET}

Each unique map has a seed (default random in [-99,99]) and a map can be viewed a received scale (default 3).
The lower the scale, the more magnified the map render will be.

Valid inputs where SEED and SCALE are integer values{gen.colors.RED}*{gen.colors.RESET}.

$ {gen.colors.GREEN}python{gen.colors.RESET} gen.py {gen.colors.BLUE}<SEED>{gen.colors.RESET} {gen.colors.BLUE}<SCALE>{gen.colors.RESET}
$ {gen.colors.GREEN}python{gen.colors.RESET} gen.py {gen.colors.BLUE}<SEED>{gen.colors.RESET}
$ {gen.colors.GREEN}python{gen.colors.RESET} gen.py

{gen.colors.RED}*{gen.colors.RESET} A negative value of SCALE explores the opposite direction of the map.
			
"""
		)
		elif len(sys.argv) == 2:
			try:
				map = gen.create_map(int(sys.argv[1]))
				gen.print_map(map)
			except:
				print(gen.colors.RED + "\nERROR: Enter a valid integer for the seed and scale!" + gen.colors.RESET + "\nFor Help: $ " + gen.colors.GREEN + "python" + gen.colors.RESET + " gen.py " + gen.colors.BLUE + "--help" + gen.colors.RESET)
		elif len(sys.argv) == 3:
			try:
				map = gen.create_map(int(sys.argv[1]), SCALE=int(sys.argv[2]))
				gen.print_map(map)
			except:
				print(gen.colors.RED + "\nERROR: Enter a valid integer for the seed and scale!" + gen.colors.RESET + "\nFor Help: $ " + gen.colors.GREEN + "python" + gen.colors.RESET + " gen.py " + gen.colors.BLUE + "--help" + gen.colors.RESET)
	else:
		map = gen.create_map(random.randint(-99, 99))
		gen.print_map(map)
		
main()