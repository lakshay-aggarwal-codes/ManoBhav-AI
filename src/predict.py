import argparse

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

from config import LABEL_NAMES, MAX_LENGTH
from preprocessing import load_saved_tokenizer


def predict_emotion(model, tokenizer, text):
    sequence = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(
        sequence,
        maxlen=MAX_LENGTH,
        padding="post",
        truncating="post",
    )

    probabilities = model.predict(padded, verbose=0)[0]
    class_id = int(np.argmax(probabilities))
    confidence = float(probabilities[class_id])

    return LABEL_NAMES[class_id], confidence


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("text", nargs="+", help="Text to classify")
    parser.add_argument(
        "--model",
        default="models/bigru_model.keras",
        help="Path to a saved Keras model",
    )
    args = parser.parse_args()

    text = " ".join(args.text)

    model = load_model(args.model)
    tokenizer = load_saved_tokenizer()

    emotion, confidence = predict_emotion(model, tokenizer, text)

    print(f"Emotion: {emotion}")
    print(f"Confidence: {confidence:.4f}")


if __name__ == "__main__":
    main()
