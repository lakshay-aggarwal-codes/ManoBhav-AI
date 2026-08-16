import sys
from pathlib import Path

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.config import LABEL_NAMES, MAX_LENGTH
from src.preprocessing import preprocess_text, load_saved_tokenizer


MODEL_PATH = "models/bigru_model.keras"
TOKENIZER_PATH = "models/tokenizer.json"

model = load_model(MODEL_PATH)
tokenizer = load_saved_tokenizer(TOKENIZER_PATH)


sentences = [
    # Same structure, different objects
    "I like bikes",
    "I like cars",
    "I like music",
    "I like books",
    "I like football",
    "I like movies",
    "I like dogs",
    "I like travelling",

    # Positive alternatives
    "I enjoy music",
    "I enjoy books",
    "I enjoy football",
    "I enjoy movies",
    "I enjoy travelling",

    # Love
    "I love music",
    "I love books",
    "I love football",
    "I love movies",
    "I love travelling",

    # Happy
    "I am happy with music",
    "I am happy with my car",
    "I am happy today",
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

    print("-" * 70)
    print(f"{text}")
    print(
        f"Prediction: {LABEL_NAMES[prediction]} "
        f"({probabilities[prediction] * 100:.2f}%)"
    )

    for label, probability in zip(LABEL_NAMES, probabilities):
        print(
            f"  {label:<10}: "
            f"{probability * 100:.2f}%"
        )
        