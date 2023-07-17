import importlib.util
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def apply_patches(enabled: bool, requirements: list):
    """
    Apply patches to certain functions. The patches are contained in each patch module under 'patches' directory.
    If a patch cannot be applied, it logs the name of the function and the exception details.
    """
    PATCHES_DIR = Path(__file__).parent / "patches"
    if not enabled:
        return
    for requirement in requirements:
        for patch_name in PATCHES_DIR.iterdir():
            if patch_name.name in requirement:
                try:
                    patch_file = PATCHES_DIR / patch_name / "patch.py"
                    if patch_file.exists():
                        spec = importlib.util.spec_from_file_location(
                            f"{patch_name}_patch", patch_file
                        )
                        patch_module = importlib.util.module_from_spec(spec)  # type: ignore
                        spec.loader.exec_module(patch_module)  # type: ignore
                        patch_module.patch()  # Apply the patch
                        logger.info(f"{patch_name} patch applied successfully")
                except Exception as e:
                    logger.debug(
                        f"{patch_name} patch could not be applied. Exception: {str(e)}"
                    )
