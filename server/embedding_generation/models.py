from collections import namedtuple
from typing import Protocol

EmbeddingModel = namedtuple('EmbeddingModel', 'name dimensions')


class EmbeddingGenerator(Protocol):
    dimensions: int

    def __init__(self, model: EmbeddingModel) -> None:
        ...

    def encode(self, text_segments: list[str]) -> list[list[float]]:
        ...

ALL_MINILM_L6_V2 = EmbeddingModel("sentence-transformers/all-MiniLM-L6-v2", 384)


