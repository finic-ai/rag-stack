from setuptools import setup

# read the contents of your README file
from os import path
this_directory = path.abspath(path.dirname(__file__))
with open(path.join(this_directory, 'README.md')) as f:
    long_description = f.read()

setup(
    name='ragstack',
    version='0.0.1',
    description='Ragstack is a one-click solution to deploy the retrieval augmented generation stack on your own infrastructure with open-source LLMs.',
    long_description=long_description,
    long_description_content_type='text/markdown',
    author='Ayan Bandyopadhyay',
    author_email='ayan@psychic.dev',
    packages=['ragstack'],
    install_requires=[
        'requests',
    ],
)
