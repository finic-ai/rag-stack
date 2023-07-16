import truss
from pathlib import Path
import requests

tr = truss.load("./falcon7b")
command = tr.docker_build_setup(build_dir=Path("./falcon7b"))
print(command)