from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

from tensorflow.keras.models import load_model

from config import LABEL_NAMES
from data_loader import load_emotion_dataset
from preprocessing import prepare_data


def evaluate_model():

    print("Loading dataset...")

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

    print("Loading BiGRU model...")

    model = load_model("models/bigru_model.keras")

    probabilities = model.predict(
        X_test,
        verbose=1
    )

    predictions = np.argmax(
        probabilities,
        axis=1
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\n" + "=" * 60)
    print("BiGRU Evaluation")
    print("=" * 60)

    print(f"\nAccuracy: {accuracy:.4f}")

    print("\nClassification Report:\n")

    print(
        classification_report(
            y_test,
            predictions,
            target_names=LABEL_NAMES,
            digits=4,
        )
    )

    cm = confusion_matrix(
        y_test,
        predictions
    )

    print("\nConfusion Matrix:")
    print(cm)

    plt.figure(figsize=(8, 6))

    sns.heatmap(
        cm,
        annot=True,
        fmt="d",
        xticklabels=LABEL_NAMES,
        yticklabels=LABEL_NAMES,
    )

    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.title("Manobhav AI - BiGRU Confusion Matrix")

    plt.tight_layout()

    Path("results").mkdir(exist_ok=True)

    output_path = (
        "results/bigru_confusion_matrix.png"
    )

    plt.savefig(
        output_path,
        dpi=150
    )

    plt.show()

    print(
        f"\nConfusion matrix saved to: {output_path}"
    )


if __name__ == "__main__":
    evaluate_model()