from http import HTTPStatus
from typing import Optional

from fastapi.responses import JSONResponse


class ModelMissingError(Exception):
    def __init__(self, path):
        self.path = path

    def __str__(self):
        return self.path


class InferenceError(RuntimeError):
    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return self.reason


class InvalidInput(ValueError):
    """
    Exception class indicating invalid input arguments.
    HTTP Servers should return HTTP_400 (Bad Request).
    """

    def __init__(self, reason):
        self.reason = reason

    def __str__(self):
        return self.reason


class ModelNotFound(Exception):
    """
    Exception class indicating requested model does not exist.
    HTTP Servers should return HTTP_404 (Not Found).
    """

    def __init__(self, model_name=None):
        self.reason = f"Model with name {model_name} does not exist."

    def __str__(self):
        return self.reason


class ModelNotReady(RuntimeError):
    def __init__(self, model_name: str, detail: Optional[str] = None):
        self.model_name = model_name
        self.error_msg = f"Model with name {self.model_name} is not ready."
        if detail:
            self.error_msg = self.error_msg + " " + detail

    def __str__(self):
        return self.error_msg


async def exception_handler(_, exc):
    return JSONResponse(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content={"error": str(exc)}
    )


async def invalid_input_handler(_, exc):
    return JSONResponse(status_code=HTTPStatus.BAD_REQUEST, content={"error": str(exc)})


async def inference_error_handler(_, exc):
    return JSONResponse(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR, content={"error": str(exc)}
    )


async def generic_exception_handler(_, exc):
    return JSONResponse(
        status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
        content={"error": f"{type(exc).__name__} : {str(exc)}"},
    )


async def model_not_found_handler(_, exc):
    return JSONResponse(status_code=HTTPStatus.NOT_FOUND, content={"error": str(exc)})


async def model_not_ready_handler(_, exc):
    return JSONResponse(
        status_code=HTTPStatus.SERVICE_UNAVAILABLE, content={"error": str(exc)}
    )


async def not_implemented_error_handler(_, exc):
    return JSONResponse(
        status_code=HTTPStatus.NOT_IMPLEMENTED, content={"error": str(exc)}
    )
