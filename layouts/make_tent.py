#!/usr/bin/env python

x_spacing = 78 #in
y_spacing = 29
z_spacing = -17

lines = []

for x in range(0, 4):
	for y in range(0, 3):
		lines.append('	{"point": [%.2f, %.2f, %.2f]}' %
			(x * x_spacing / 6, 
			y * y_spacing / 6,
			z_spacing / 6 if y == 1 else 0))
print '[\n' + ',\n'.join(lines) + '\n]'

