import truss
from pathlib import Path
import requests

tr = truss.load("./llama2-7b")
command = tr.docker_build_setup(build_dir=Path("./llama2-7b"))
print(command)