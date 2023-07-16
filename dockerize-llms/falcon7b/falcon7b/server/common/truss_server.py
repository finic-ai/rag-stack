import asyncio
import concurrent.futures
import json
import logging
import multiprocessing
import os
import signal
import socket
from pathlib import Path
from typing import Dict, List, Optional, Union

import common.errors as errors
import common.util as utils
import uvicorn
from common.logging import setup_logging
from common.serialization import (
    DeepNumpyEncoder,
    truss_msgpack_deserialize,
    truss_msgpack_serialize,
)
from fastapi import Depends, FastAPI, Request
from fastapi.responses import ORJSONResponse
from fastapi.routing import APIRoute as FastAPIRoute
from model_wrapper import ModelWrapper
from starlette.responses import Response


async def parse_body(request: Request) -> bytes:
    """
    Used by FastAPI to read body in an asynchronous manner
    """
    return await request.body()


FORMAT = "%(asctime)s.%(msecs)03d %(name)s %(levelname)s [%(funcName)s():%(lineno)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
INFERENCE_SERVER_FAILED_FILE = Path("~/inference_server_crashed.txt").expanduser()
logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt=DATE_FORMAT)


class UvicornCustomServer(multiprocessing.Process):
    def __init__(
        self, config: uvicorn.Config, sockets: Optional[List[socket.socket]] = None
    ):
        super().__init__()
        self.sockets = sockets
        self.config = config

    def stop(self):
        self.terminate()

    def run(self):
        server = uvicorn.Server(config=self.config)
        asyncio.run(server.serve(sockets=self.sockets))


class BasetenEndpoints:
    """The implementation of the model server endpoints.

    Historically, we relied on the kserve server interface, which assumes that
    multiple models are running behind a registry. As a result, some arguments to
    to functions will rename unused except for backwards compatibility checks.
    """

    def __init__(self, model: ModelWrapper) -> None:
        self._model = model

    def _safe_lookup_model(self, model_name: str) -> ModelWrapper:
        if model_name != self._model.name:
            raise errors.ModelMissingError(model_name)
        return self._model

    @staticmethod
    def check_healthy(model: ModelWrapper):
        if model.load_failed():
            INFERENCE_SERVER_FAILED_FILE.touch()
            os.kill(os.getpid(), signal.SIGKILL)

        if not model.ready:
            raise errors.ModelNotReady(model.name)

    async def model_ready(self, model_name: str) -> Dict[str, Union[str, bool]]:
        self.check_healthy(self._safe_lookup_model(model_name))

        return {}

    async def invocations_ready(self) -> Dict[str, Union[str, bool]]:
        """
        This method provides compatibility with Sagemaker hosting for the 'ping' endpoint.
        """
        if self._model is None:
            raise errors.ModelMissingError("model")
        self.check_healthy(self._model)

        return {}

    def invocations(
        self, request: Request, body_raw: bytes = Depends(parse_body)
    ) -> Response:
        """
        This method provides compatibility with Sagemaker hosting for the 'invocations' endpoint.
        """
        return self.predict(self._model.name, request, body_raw)

    def predict(
        self, model_name: str, request: Request, body_raw: bytes = Depends(parse_body)
    ) -> Response:
        """
        This method is called by FastAPI, which introspects that it's not async, and schedules it on a thread
        """
        model: ModelWrapper = self._safe_lookup_model(model_name)

        self.check_healthy(model)

        body: Dict
        if self.is_binary(request):
            body = truss_msgpack_deserialize(body_raw)
        else:
            body = json.loads(body_raw)

        # calls ModelWrapper.__call__, which runs validate, preprocess, predict, and postprocess
        response: Dict = asyncio.run(model(body, headers=dict(request.headers.items())))

        response_headers = {}
        if self.is_binary(request):
            response_headers["Content-Type"] = "application/octet-stream"
            return Response(
                content=truss_msgpack_serialize(response), headers=response_headers
            )
        else:
            response_headers["Content-Type"] = "application/json"
            return Response(
                content=json.dumps(response, cls=DeepNumpyEncoder),
                headers=response_headers,
            )

    @staticmethod
    def is_binary(request: Request):
        return (
            "Content-Type" in request.headers
            and request.headers["Content-Type"] == "application/octet-stream"
        )


class TrussServer:
    def __init__(
        self,
        http_port: int,
        config: Dict,
        setup_json_logger: bool = True,
    ):
        self.http_port = http_port
        self._config = config
        self._model = ModelWrapper(self._config)
        self._endpoints = BasetenEndpoints(self._model)
        self._setup_json_logger = setup_json_logger

    def cleanup(self):
        if INFERENCE_SERVER_FAILED_FILE.exists():
            INFERENCE_SERVER_FAILED_FILE.unlink()

    def on_startup(self):
        """
        This method will be started inside the main process, so here is where we want to setup our logging and model
        """
        self.cleanup()

        if self._setup_json_logger:
            setup_logging()

        self._model.start_load()

    def create_application(self):
        return FastAPI(
            title="Baseten Inference Server",
            docs_url=None,
            redoc_url=None,
            default_response_class=ORJSONResponse,
            on_startup=[self.on_startup],
            routes=[
                # liveness endpoint
                FastAPIRoute(r"/", lambda: True),
                # readiness endpoint
                FastAPIRoute(
                    r"/v1/models/{model_name}", self._endpoints.model_ready, tags=["V1"]
                ),
                FastAPIRoute(
                    r"/v1/models/{model_name}:predict",
                    self._endpoints.predict,
                    methods=["POST"],
                    tags=["V1"],
                ),
                FastAPIRoute(
                    r"/v1/models/{model_name}:predict_binary",
                    self._endpoints.predict,
                    methods=["POST"],
                    tags=["V1"],
                ),
                # Endpoint aliases for Sagemaker hosting
                FastAPIRoute(r"/ping", self._endpoints.invocations_ready),
                FastAPIRoute(
                    r"/invocations",
                    self._endpoints.invocations,
                    methods=["POST"],
                ),
            ],
            exception_handlers={
                errors.InferenceError: errors.inference_error_handler,
                errors.ModelNotFound: errors.model_not_found_handler,
                errors.ModelNotReady: errors.model_not_ready_handler,
                NotImplementedError: errors.not_implemented_error_handler,
                Exception: errors.generic_exception_handler,
            },
        )

    def start(self):
        cfg = uvicorn.Config(
            self.create_application(),
            host="0.0.0.0",
            port=self.http_port,
            workers=1,
            log_config={
                "version": 1,
                "formatters": {
                    "default": {
                        "()": "uvicorn.logging.DefaultFormatter",
                        "datefmt": DATE_FORMAT,
                        "fmt": "%(asctime)s.%(msecs)03d %(name)s %(levelprefix)s %(message)s",
                        "use_colors": None,
                    },
                    "access": {
                        "()": "uvicorn.logging.AccessFormatter",
                        "datefmt": DATE_FORMAT,
                        "fmt": "%(asctime)s.%(msecs)03d %(name)s %(levelprefix)s %(client_addr)s %(process)s - "
                        '"%(request_line)s" %(status_code)s',
                        # noqa: E501
                    },
                },
                "handlers": {
                    "default": {
                        "formatter": "default",
                        "class": "logging.StreamHandler",
                        "stream": "ext://sys.stderr",
                    },
                    "access": {
                        "formatter": "access",
                        "class": "logging.StreamHandler",
                        "stream": "ext://sys.stdout",
                    },
                },
                "loggers": {
                    "uvicorn": {"handlers": ["default"], "level": "INFO"},
                    "uvicorn.error": {"level": "INFO"},
                    "uvicorn.access": {
                        "handlers": ["access"],
                        "level": "INFO",
                        "propagate": False,
                    },
                },
            },
        )

        max_asyncio_workers = min(32, utils.cpu_count() + 4)
        logging.info(f"Setting max asyncio worker threads as {max_asyncio_workers}")
        # Call this so uvloop gets used
        cfg.setup_event_loop()
        asyncio.get_event_loop().set_default_executor(
            concurrent.futures.ThreadPoolExecutor(max_workers=max_asyncio_workers)
        )

        async def serve():
            serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            serversocket.bind((cfg.host, cfg.port))
            serversocket.listen(5)

            logging.info(f"starting uvicorn with {cfg.workers} workers")
            for _ in range(cfg.workers):
                server = UvicornCustomServer(config=cfg, sockets=[serversocket])
                server.start()

        async def servers_task():
            servers = [serve()]
            await asyncio.gather(*servers)

        asyncio.run(servers_task())
