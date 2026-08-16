from fastapi import FastAPI, HTTPException 
import os   
import re
from pydantic import BaseModel, Field
import pickle
from keras.models import load_model
from contextlib import asynccontextmanager
import numpy as np
from fastapi.middleware.cors import CORSMiddleware 
from tensorflow.keras.preprocessing.sequence import pad_sequences
from src.preprocessing import preprocess_text, load_saved_tokenizer
  

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(
    BASE_DIR,
    "models",
    "bigru_model.keras"
)

tokenizer_path = os.path.join(
    BASE_DIR,
    "models",
    "tokenizer.json"
)

max_sequence_length = 50
emotion_labels = [
    "sadness",
    "joy",
    "love",
    "anger",
    "fear",
    "surprise",
]
emotion_emojis = {
    "sadness": "😢",
    "joy": "😊",
    "love": "❤️",
    "anger": "😡",
    "fear": "😨",
    "surprise": "😲",
}


def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"'", "", text)
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


class TextInput(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="The sentence to analyze",
        json_schema_extra={"example": "I feel so happy and excited"},
    )


class PredictionResponse(BaseModel):
    text: str
    predicted_emotion: str
    confidence: float
    all_probabilities: dict[str, float]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

dl_model ={}

@asynccontextmanager 
async def lifespan(app: FastAPI):
    print("Loading modeal and tokenizer....")
    dl_model['BiGRU'] = load_model(model_path)
    dl_model["Tokenizer"] = load_saved_tokenizer(tokenizer_path)
    print("Model loaded successfully....")
    
    yield   
    dl_model.clear()
    

app = FastAPI(lifespan=lifespan)
    
    
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)
 

 

@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(status="Server is Running", model_loaded=bool(dl_model))

@app.post('/predict', response_model=PredictionResponse)
def predict_emotion(text_input :TextInput):
    BiGRU_model = dl_model.get("BiGRU")
    tokenizer_model = dl_model.get("Tokenizer")
    
    if BiGRU_model is None or tokenizer_model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded yet.Please try again later")
        
    cleaned_text = preprocess_text(text_input.text) 
    tokenized_text = tokenizer_model.texts_to_sequences([cleaned_text])
    padded_sequence = pad_sequences(
        tokenized_text,
        maxlen= max_sequence_length,
        padding='post',
        truncating='post'
    )

    probabilities = BiGRU_model.predict(padded_sequence)[0]
    top_emotion_index = int(np.argmax(probabilities))
    all_probabilities = {
        label: float(prob) for prob, label in zip(probabilities, emotion_labels)     
    }
    
    return PredictionResponse(
        text = text_input.text,
        predicted_emotion= emotion_labels[top_emotion_index],
        confidence= float(probabilities[top_emotion_index]),
        all_probabilities= all_probabilities
    )
    