import sys
from pathlib import Path
from collections import Counter

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = PROJECT_ROOT / "src"

sys.path.insert(0, str(SRC_DIR))

from data_loader import load_emotion_dataset
from config import LABEL_NAMES


dataset = load_emotion_dataset()

keywords = [
    "bike",
    "bikes",
    "love",
    "like",
    "enjoy",
    "favorite",
    "happy",
    "scared",
    "hate",
    "angry",
]


for keyword in keywords:

    print("\n" + "=" * 70)
    print(f"KEYWORD: {keyword}")
    print("=" * 70)

    counter = Counter()

    for split in ["train", "validation", "test"]:

        texts = dataset[split]["text"]
        labels = dataset[split]["label"]

        for text, label in zip(texts, labels):

            if keyword.lower() in text.lower():
                emotion = LABEL_NAMES[int(label)]
                counter[emotion] += 1

    print("Emotion distribution:")
    for emotion, count in counter.items():
        print(f"{emotion:10s}: {count}")

    print(f"\nTotal occurrences: {sum(counter.values())}")


print("\n\n" + "=" * 70)
print("EXAMPLES CONTAINING 'BIKE'")
print("=" * 70)

count = 0

for text, label in zip(
    dataset["train"]["text"],
    dataset["train"]["label"]
):

    if "bike" in text.lower():

        print(
            f"{LABEL_NAMES[int(label)]:10s} -> {text}"
        )

        count += 1

        if count >= 50:
            break