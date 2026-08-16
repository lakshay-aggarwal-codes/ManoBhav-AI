# NLP Emotion Classification

A deep-learning NLP project using the DAIR.AI Emotion dataset and comparing:

- Simple RNN
- LSTM
- GRU
- Bidirectional GRU (BiGRU)

## Dataset

The project loads `dair-ai/emotion` from Hugging Face.

Dataset splits used by the project:

- Train: 16,000
- Validation: 2,000
- Test: 2,000

## Project structure

```text
nlp-emotion-classification/
├── data/
├── models/
├── results/
├── notebooks/
├── src/
│   ├── config.py
│   ├── data_loader.py
│   ├── preprocessing.py
│   ├── models.py
│   ├── train.py
│   ├── evaluate.py
│   └── predict.py
├── requirements.txt
├── .gitignore
└── README.md
```

## Setup in VS Code

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

## Train all models

From the project root:

```powershell
python src/train.py
```

This trains and saves:

```text
models/rnn_model.keras
models/lstm_model.keras
models/gru_model.keras
models/bigru_model.keras
models/tokenizer.json
```

It also creates:

```text
results/model_comparison.csv
```

## Make a prediction

After training:

```powershell
python src/predict.py "I am extremely happy today!"
```

By default, prediction uses the BiGRU model.

To use another model:

```powershell
python src/predict.py "I am extremely happy today!" --model models/lstm_model.keras
```

## Notes

The original Colab notebook had a few issues that are corrected in this VS Code version:

1. The GRU model was accidentally built with LSTM layers. It is now a real GRU model.
2. The test set was being used as validation data. This version uses the dataset's dedicated validation split and keeps the test set for final evaluation.
3. The BiGRU prediction code had `prdeict` instead of `predict`.
4. The sample prediction code had `sampple_sequences` instead of `sample_sequences`.
5. Model/tokenizer saving is included so the trained models do not need to be retrained just to make predictions.

## Notebook

The original Colab notebook is preserved in:

```text
notebooks/nlp_dl_project.ipynb
```
