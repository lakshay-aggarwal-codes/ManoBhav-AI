import sys
from pathlib import Path

import numpy as np
from tensorflow.keras.models import load_model

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.preprocessing import preprocess_text, load_saved_tokenizer
from src.config import LABEL_NAMES, MAX_LENGTH
from tensorflow.keras.preprocessing.sequence import pad_sequences


MODEL_PATH = "models/bigru_model.keras"
TOKENIZER_PATH = "models/tokenizer.json"


model = load_model(MODEL_PATH)
tokenizer = load_saved_tokenizer(TOKENIZER_PATH)


sentences = [
    "I like bike riding",
    "I feel that I like bike riding",
    "I feel like I like bike riding",
    "I enjoy bike riding",
    "I really enjoy bike riding",
    "I love bike riding",
    "I am happy riding my bike",
    "I like riding my bike",
    "I enjoy riding my bike",
    "Bike riding is my favorite",
    "I am passionate about bike riding",
]


for text in sentences:

    cleaned = preprocess_text(text)

    sequence = tokenizer.texts_to_sequences([cleaned])

    padded = pad_sequences(
        sequence,
        maxlen=MAX_LENGTH,
        padding="post",
        truncating="post",
    )

    probabilities = model.predict(
        padded,
        verbose=0,
    )[0]

    prediction = int(np.argmax(probabilities))

    print("=" * 70)
    print(f"Text: {text}")
    print(f"Prediction: {LABEL_NAMES[prediction]}")
    print(f"Confidence: {probabilities[prediction] * 100:.2f}%")

    for label, probability in zip(
        LABEL_NAMES,
        probabilities,
    ):
        print(
            f"  {label:<10}: "
            f"{probability * 100:.2f}%"
        )