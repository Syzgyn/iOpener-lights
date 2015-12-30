#!/usr/bin/env python

from distutils.core import setup, Extension

setup(
	ext_modules=[
		Extension('patterns.single.shader', ['patterns/single/shader.c'],
			extra_compile_args=['-Os', '-funroll-loops', '-ffast-math', '-std=c99'],
		),
	],
)
