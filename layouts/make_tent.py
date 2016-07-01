#!/usr/bin/env python

x_spacing = 3.0
y_spacing = 3.0
z_spacing = 1.0

x_total = 4
y_total = 4

half_x = (x_spacing * (x_total - 1)) / 2
half_y = (y_spacing * (y_total - 1)) / 2

lines = []

for x in range(0, x_total):
	for y in range(0, y_total):
		lines.append('	{"point": [%.2f, %.2f, %.2f]}' %
			(x * x_spacing - half_x, 
			y * y_spacing - half_y,
			z_spacing if y in range(1, y_total - 1) else 0))
print '[\n' + ',\n'.join(lines) + '\n]'

