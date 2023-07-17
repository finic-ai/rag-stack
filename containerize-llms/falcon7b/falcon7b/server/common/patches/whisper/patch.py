"""
Patch for OpenAi/Whisper:

Whisper currently uses tqdm for the progress bar during the download of Whisper weights from Azure.
However, when Transfer-Encoding=Chunked, the Content-Length is not set, causing the loading process
to fail. This patch makes the download more defensive, addressing this issue. tqdm progress bar still
works when the Content-Length is None.
Open PR (https://github.com/openai/whisper/pull/1366) - once merged we can remove the patch.
"""
import os
from typing import Union


def _download(url: str, root: str, in_memory: bool) -> Union[bytes, str]:
    import hashlib
    import urllib.request
    import warnings

    from tqdm import tqdm

    os.makedirs(root, exist_ok=True)
    expected_sha256 = url.split("/")[-2]
    download_target = os.path.join(root, os.path.basename(url))

    if os.path.exists(download_target) and not os.path.isfile(download_target):
        raise RuntimeError(f"{download_target} exists and is not a regular file")

    if os.path.isfile(download_target):
        with open(download_target, "rb") as f:
            model_bytes = f.read()
        if hashlib.sha256(model_bytes).hexdigest() == expected_sha256:
            return model_bytes if in_memory else download_target
        else:
            warnings.warn(
                f"{download_target} exists, but the SHA256 checksum does not match; re-downloading the file"
            )

    with urllib.request.urlopen(url) as source, open(download_target, "wb") as output:
        with tqdm(
            total=int(source.info().get("Content-Length"))
            if source.info().get("Content-Length") is not None
            else None,
            ncols=80,
            unit="iB",
            unit_scale=True,
            unit_divisor=1024,
        ) as loop:
            while True:
                buffer = source.read(8192)
                if not buffer:
                    break

                output.write(buffer)
                loop.update(len(buffer))

    model_bytes = open(download_target, "rb").read()
    if hashlib.sha256(model_bytes).hexdigest() != expected_sha256:
        raise RuntimeError(
            "Model has been downloaded but the SHA256 checksum does not not match. Please retry loading the model."
        )

    return model_bytes if in_memory else download_target


def patch():
    import whisper

    whisper._download = _download
