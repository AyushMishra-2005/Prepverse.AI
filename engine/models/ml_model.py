from sentence_transformers import SentenceTransformer, CrossEncoder
import torch
from config.config import Config

bi_encoder = None
cross_encoder = None

def load_models():
    global bi_encoder, cross_encoder

    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")

    if device == "cuda":
        print("GPU:", torch.cuda.get_device_name(0))

    try:
        print("Loading bi-encoder model...")
        bi_encoder = SentenceTransformer(
            Config.BI_ENCODER_MODEL,
            device=device,
            trust_remote_code=True
        )
        print(f"Bi-encoder loaded on {bi_encoder.device}.")

        print("Loading cross-encoder model...")
        cross_encoder = CrossEncoder(
            Config.CROSS_ENCODER_MODEL,
            device=device
        )
        print("Cross-encoder loaded.")

    except Exception as e:
        print("Error loading models:", str(e))
        raise e


def get_models():
    if bi_encoder is None or cross_encoder is None:
        raise RuntimeError("Models not loaded. Call load_models() first.")

    return bi_encoder, cross_encoder