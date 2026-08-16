from pathlib import Path

import numpy as np
from sklearn.utils import class_weight
from tensorflow.keras.callbacks import EarlyStopping

from config import BATCH_SIZE, EPOCHS
from data_loader import load_emotion_dataset
from models import build_bigru, build_gru, build_lstm, build_rnn
from preprocessing import prepare_data, save_tokenizer


def train_and_save(name, model, X_train, y_train, X_val, y_val, X_test, y_test, weights):
    print(f"\n{'=' * 60}\nTraining {name}\n{'=' * 60}")

    early_stopping = EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True,
    )

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        class_weight=weights,
        callbacks=[early_stopping],
    )

    loss, accuracy = model.evaluate(X_test, y_test, verbose=0)

    Path("models").mkdir(exist_ok=True)
    model.save(f"models/{name.lower()}_model.keras")

    print(f"{name} test loss: {loss:.4f}")
    print(f"{name} test accuracy: {accuracy:.4f}")

    return history, loss, accuracy


def main():
    dataset = load_emotion_dataset()

    (
        tokenizer,
        X_train,
        y_train,
        X_val,
        y_val,
        X_test,
        y_test,
    ) = prepare_data(dataset)

    save_tokenizer(tokenizer)

    weights_array = class_weight.compute_class_weight(
        class_weight="balanced",
        classes=np.unique(y_train),
        y=y_train,
    )
    weights = dict(enumerate(weights_array))

    print("Train:", X_train.shape, y_train.shape)
    print("Validation:", X_val.shape, y_val.shape)
    print("Test:", X_test.shape, y_test.shape)

    models = {
        "RNN": build_rnn(),
        "LSTM": build_lstm(),
        "GRU": build_gru(),
        "BiGRU": build_bigru(),
    }

    results = []

    for name, model in models.items():
        _, loss, accuracy = train_and_save(
            name,
            model,
            X_train,
            y_train,
            X_val,
            y_val,
            X_test,
            y_test,
            weights,
        )
        results.append({
            "Model": name,
            "Test Loss": loss,
            "Accuracy": accuracy,
        })

    import pandas as pd

    result_df = (
        pd.DataFrame(results)
        .sort_values("Accuracy", ascending=False)
        .reset_index(drop=True)
    )

    Path("results").mkdir(exist_ok=True)
    result_df.to_csv("results/model_comparison.csv", index=False)

    print("\nModel comparison:")
    print(result_df.to_string(index=False))


if __name__ == "__main__":
    main()
