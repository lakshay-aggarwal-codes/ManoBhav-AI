from tensorflow.keras.layers import (
    Bidirectional,
    Dense,
    Dropout,
    Embedding,
    GRU,
    LSTM,
    SimpleRNN,
)
from tensorflow.keras.models import Sequential

from config import (
    BIGRU_EMBEDDING_DIM,
    DROPOUT,
    EMBEDDING_DIM,
    MAX_WORDS,
    NUM_CLASSES,
    RNN_UNITS_1,
    RNN_UNITS_2,
)


def compile_model(model):
    model.compile(
        optimizer="adam",
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def build_rnn():
    model = Sequential([
        Embedding(MAX_WORDS, EMBEDDING_DIM),
        SimpleRNN(RNN_UNITS_1, return_sequences=True),
        Dropout(DROPOUT),
        SimpleRNN(RNN_UNITS_2),
        Dropout(DROPOUT),
        Dense(NUM_CLASSES, activation="softmax"),
    ])
    return compile_model(model)


def build_lstm():
    model = Sequential([
        Embedding(MAX_WORDS, EMBEDDING_DIM),
        LSTM(RNN_UNITS_1, return_sequences=True),
        Dropout(DROPOUT),
        LSTM(RNN_UNITS_2),
        Dropout(DROPOUT),
        Dense(NUM_CLASSES, activation="softmax"),
    ])
    return compile_model(model)


def build_gru():
    model = Sequential([
        Embedding(MAX_WORDS, EMBEDDING_DIM),
        GRU(RNN_UNITS_1, return_sequences=True),
        Dropout(DROPOUT),
        GRU(RNN_UNITS_2),
        Dropout(DROPOUT),
        Dense(NUM_CLASSES, activation="softmax"),
    ])
    return compile_model(model)


def build_bigru():
    model = Sequential([
        Embedding(MAX_WORDS, BIGRU_EMBEDDING_DIM),
        Bidirectional(GRU(RNN_UNITS_1, return_sequences=True)),
        Dropout(DROPOUT),
        Bidirectional(GRU(RNN_UNITS_2)),
        Dropout(DROPOUT),
        Dense(NUM_CLASSES, activation="softmax"),
    ])
    return compile_model(model)
