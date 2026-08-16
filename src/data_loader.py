from datasets import load_dataset


def load_emotion_dataset():
    """Load the DAIR.AI Emotion dataset from Hugging Face."""
    return load_dataset("dair-ai/emotion")
