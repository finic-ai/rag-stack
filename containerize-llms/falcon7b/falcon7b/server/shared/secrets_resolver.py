import os
from collections.abc import Mapping
from pathlib import Path
from typing import Dict


class SecretsResolver:
    SECRETS_MOUNT_DIR = "/secrets"
    SECRET_ENV_VAR_PREFIX = "TRUSS_SECRET_"

    @staticmethod
    def get_secrets(config: Dict):
        return Secrets(config.get("secrets", {}))

    @staticmethod
    def _resolve_secret(secret_name: str, default_value: str):
        secret_value = default_value
        secret_env_var_name = SecretsResolver.SECRET_ENV_VAR_PREFIX + secret_name
        if secret_env_var_name in os.environ:
            secret_value = os.environ[secret_env_var_name]
        secret_path = SecretsResolver._secrets_mount_dir_path() / secret_name
        if secret_path.exists() and secret_path.is_file():
            with secret_path.open() as secret_file:
                secret_value = secret_file.read()
        return secret_value

    @staticmethod
    def _secrets_mount_dir_path():
        return Path(SecretsResolver.SECRETS_MOUNT_DIR)


class Secrets(Mapping):
    def __init__(self, base_secrets: Dict[str, str]):
        self._base_secrets = base_secrets

    def __getitem__(self, key: str) -> str:
        return SecretsResolver._resolve_secret(key, self._base_secrets[key])

    def __iter__(self):
        raise NotImplementedError(
            "Secrets are meant for lookup and can't be iterated on"
        )

    def __len__(self):
        return len(self._base_secrets)
