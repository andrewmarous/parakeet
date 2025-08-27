from typing import Optional
from enum import Enum

from argdantic import ArgParser
from pydantic import BaseModel
from tqdm import tqdm

from huggingface_hub import hf_hub_download

cli = ArgParser()

class DatasetSource(Enum):
    REPO = "repo"
    LOCAL = "local"

class TextDataProcessConfig(BaseModel):
    source: DatasetSource
    source_path: str
    output_path: str

    subsample_size: Optional[int]
    aug: bool = False

def convert_subset(set_name: str, config: TextDataProcessConfig):
    # TODO: generate embeddings for text dataset, perform masking
    # at training time
    ...


