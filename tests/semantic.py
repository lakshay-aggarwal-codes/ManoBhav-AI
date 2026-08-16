import sys
from pathlib import Path

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Add src to Python path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"

sys.path.insert(0, str(SRC_DIR))

from config import LABEL_NAMES, MAX_LENGTH
from preprocessing import load_saved_tokenizer


MODEL_PATH = PROJECT_ROOT / "models" / "bigru_model.keras"
TOKENIZER_PATH = PROJECT_ROOT / "models" / "tokenizer.json"


sample_texts = [
    "I love bikes",
    "I like bikes",
    "I enjoy bikes",
    "Bikes are my favorite",
    "I really enjoy riding bikes",
    "I am happy with my bike",

    "I hate bikes",
    "I dislike bikes",

    "I am scared of riding bikes",
    "I am sad about my bike",
    "I am angry about my bike",
]


print("Loading tokenizer...")

tokenizer = load_saved_tokenizer(
    str(TOKENIZER_PATH)
)

print("Loading BiGRU model...")

model = load_model(
    MODEL_PATH
)

print("Model loaded successfully.")


sequences = tokenizer.texts_to_sequences(
    sample_texts
)

padded_sequences = pad_sequences(
    sequences,
    maxlen=MAX_LENGTH,
    padding="post",
    truncating="post",
)


predictions = model.predict(
    padded_sequences,
    verbose=0
)


for text, probabilities in zip(
    sample_texts,
    predictions
):

    predicted_index = int(
        np.argmax(probabilities)
    )

    predicted_emotion = LABEL_NAMES[
        predicted_index
    ]

    confidence = probabilities[
        predicted_index
    ] * 100

    print("\n" + "=" * 60)

    print(f"Text: {text}")

    print(
        f"Prediction: {predicted_emotion}"
    )

    print(
        f"Confidence: {confidence:.2f}%"
    )

    print("\nAll probabilities:")

    for label, probability in zip(
        LABEL_NAMES,
        probabilities
    ):

        print(
            f"  {label:10s}: "
            f"{probability * 100:.2f}%"
        )