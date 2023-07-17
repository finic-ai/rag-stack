import os
from typing import Dict

import yaml
from common.logging import setup_logging
from common.truss_server import TrussServer  # noqa: E402

CONFIG_FILE = "config.yaml"

setup_logging()


class ConfiguredTrussServer:
    _config: Dict
    _port: int

    def __init__(self, config_path: str, port: int):
        self._port = port
        with open(config_path, encoding="utf-8") as config_file:
            self._config = yaml.safe_load(config_file)

    def start(self):
        server = TrussServer(http_port=self._port, config=self._config)
        server.start()


if __name__ == "__main__":
    env_port = int(os.environ.get("INFERENCE_SERVER_PORT", "8080"))
    ConfiguredTrussServer(CONFIG_FILE, env_port).start()
