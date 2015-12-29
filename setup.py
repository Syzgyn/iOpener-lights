#!/usr/bin/env python

from distutils.core import setup, Extension

setup(
	packages=['patterns.single.solidRainbow'],
	ext_modules=[
		Extension('patterns.single.solidRainbow.shader', ['patterns/single/solidRainbow/shader.c'],
			extra_compile_args=['-Os', '-funroll-loops', '-ffast-math'],
		),
	],
)
