#!/usr/bin/env python

from setuptools import setup, find_packages

setup(name='stoplight',
      version='0.1.0alpha',
      description='Stoplight chart generator web application',
      author='Chris Erickson',
      author_email='erickson.christopher.k@gmail.com',
      packages=find_packages(),
      requires=['Flask']
     )
