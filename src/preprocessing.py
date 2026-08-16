import re
from pathlib import Path

import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from src.config import MAX_LENGTH, MAX_WORDS


def preprocess_text(text: str) -> str: 
    text = text.lower()
    text = re.sub(r"'", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()

    return text


def prepare_data(dataset): 
    train_texts = [
        preprocess_text(text)
        for text in dataset["train"]["text"]
    ]

    validation_texts = [
        preprocess_text(text)
        for text in dataset["validation"]["text"]
    ]

    test_texts = [
        preprocess_text(text)
        for text in dataset["test"]["text"]
    ]

    train_labels = np.asarray(dataset["train"]["label"])
    validation_labels = np.asarray(dataset["validation"]["label"])
    test_labels = np.asarray(dataset["test"]["label"])

    tokenizer = Tokenizer(
        num_words=MAX_WORDS,
        oov_token="<unk>",
    )
 
    tokenizer.fit_on_texts(train_texts)

    def encode(texts):
        sequences = tokenizer.texts_to_sequences(texts)

        return pad_sequences(
            sequences,
            maxlen=MAX_LENGTH,
            padding="post",
            truncating="post",
        )

    return (
        tokenizer,
        encode(train_texts),
        train_labels,
        encode(validation_texts),
        validation_labels,
        encode(test_texts),
        test_labels,
    )


def save_tokenizer(tokenizer, path="models/tokenizer.json"):
 
    Path(path).parent.mkdir(parents=True, exist_ok=True)

    Path(path).write_text(
        tokenizer.to_json(),
        encoding="utf-8",
    )


def load_saved_tokenizer(path="models/tokenizer.json"):
 
    from tensorflow.keras.preprocessing.text import tokenizer_from_json

    return tokenizer_from_json(
        Path(path).read_text(encoding="utf-8")
    )