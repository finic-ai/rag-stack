from embedding_generation.models import EmbeddingGenerator, EmbeddingModel
from sentence_transformers import SentenceTransformer


class SentenceTransformerEmbedding(EmbeddingGenerator):
    def __init__(self, model: EmbeddingModel):
        self.model_instance = SentenceTransformer(model.name)
        self.dimensions = model.dimensions

    def encode(self, text_segments: list[str]) -> list[list[float]]:
        return self.model_instance.encode(text_segments)
