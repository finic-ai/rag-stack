from embedding_generation.models import EmbeddingGenerator, EmbeddingModel

import requests


class HuggingfaceInferenceEndpoingEmbedding(EmbeddingGenerator):
    def __init__(self, model: EmbeddingModel, hf_token):
        self.url = f'https://api-inference.huggingface.co/pipeline/feature-extraction/{model.name}'
        self.headers = {"Authorization": f"Bearer {hf_token}"}
        self.dimensions = model.dimensions

    def query(self, text_segments):
        response = requests.post(self.url, headers=self.headers, json={"inputs": text_segments, "options":{"wait_for_model":True}})
        return response.json()

    def encode(self, text_segments: list[str]) -> list[list[float]]:
        return self.query(text_segments)
