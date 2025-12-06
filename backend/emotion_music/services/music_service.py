import os
from dotenv import load_dotenv
import requests
import numpy as np
from PIL import Image
import keras
from keras.models import load_model
from keras.layers import Layer
import keras.ops as ops

load_dotenv()

# Define the custom AttentionLayer
@keras.saving.register_keras_serializable()
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super(AttentionLayer, self).__init__(**kwargs)
    
    def build(self, input_shape):
        # Create trainable weights
        self.W = self.add_weight(
            name='attention_weight',
            shape=(input_shape[-1], input_shape[-1]),
            initializer='glorot_uniform',
            trainable=True
        )
        self.b = self.add_weight(
            name='attention_bias',
            shape=(input_shape[-1],),
            initializer='zeros',
            trainable=True
        )
        super(AttentionLayer, self).build(input_shape)
    
    def call(self, x):
        # Apply attention mechanism
        e = ops.tanh(ops.dot(x, self.W) + self.b)
        a = ops.softmax(e, axis=-1)
        output = x * a
        return output
    
    def get_config(self):
        config = super(AttentionLayer, self).get_config()
        return config

# Model path
model_path = os.path.join(os.path.dirname(__file__), 'models', 'best_fer_model.keras')

# Don't load model at import time - load it when needed
_model = None

def get_model():
    """Lazy load the model only when needed"""
    global _model
    if _model is None:
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model file not found at: {model_path}\n"
                f"Please ensure the file exists in the correct location."
            )
        # Load model with custom objects
        _model = load_model(
            model_path,
            custom_objects={'AttentionLayer': AttentionLayer}
        )
    return _model

LASTFM_API_KEY = os.getenv("LAST_FM_API_KEY")
LASTFM_BASE = "http://ws.audioscrobbler.com/2.0/"

EMOTION_TO_TAGS = {
    "happy": ["pop", "dance", "upbeat"],
    "sad": ["acoustic", "piano", "blues"],
    "angry": ["rock", "metal", "punk"],
    "calm": ["ambient", "chillout"],
    "surprise": ["electronic"],
    "fear": ["soundtrack", "atmospheric"],
    "disgust": ["alternative"],
    "neutral": ["indie"]
}

def preprocess_image(image_path, img_size=(72, 72)):
    img = Image.open(image_path).convert('L')  # Grayscale
    img = img.resize(img_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = np.expand_dims(img_array, axis=-1)  # Add channel dimension
    return img_array

def predict_emotion_from_image(image_path):
    try:
        # Get model (loads lazily on first call)
        model = get_model()
        
        # Preprocess
        processed_image = preprocess_image(image_path)
        
        # Predict
        prediction = model.predict(processed_image, verbose=0)
        
        if isinstance(prediction, np.ndarray) and prediction.ndim > 1:
            # Get the index with highest probability
            emotion_idx = np.argmax(prediction[0])
            emotion_classes = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"]
            emotion = emotion_classes[emotion_idx]
            confidence = float(prediction[0][emotion_idx])
        else:
            emotion = str(prediction)
            confidence = 1.0
        
        return emotion, confidence
    
    except FileNotFoundError as e:
        print(f"Model file error: {e}")
        return "neutral", 0.0
    except Exception as e:
        print(f"Error predicting emotion: {e}")
        return "neutral", 0.0

def recommend_songs(emotion, api_key=LASTFM_API_KEY, limit=5):
    if not api_key:
        api_key = LASTFM_API_KEY
    
    print(f"Using API key: {api_key[:5]}...")
    
    tags = EMOTION_TO_TAGS.get(emotion, ["pop"])
    tag = tags[0]
    print(f"Emotion: {emotion}, Tag: {tag}")
    
    params = {
        "method": "tag.gettoptracks",
        "tag": tag,
        "api_key": api_key,
        "format": "json",
        "limit": limit
    }
    
    try:
        response = requests.get(LASTFM_BASE, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"API Response: {data}")
        
        # Check for API errors
        if "error" in data:
            print(f"Last.fm API Error: {data['error']} - {data.get('message')}")
            return []
        
        # Extract tracks
        tracks = data.get("tracks", {}).get("track", [])
        if not tracks:
            print("No tracks found")
            return []
        
        # Handle single track case (API returns dict instead of list)
        if isinstance(tracks, dict):
            tracks = [tracks]
        
        result = []
        for track in tracks[:limit]:
            artist = track.get("artist", {})
            artist_name = artist.get("name") if isinstance(artist, dict) else artist
            
            result.append({
                "title": track.get("name", "Unknown"),
                "artist": artist_name or "Unknown",
                "lastfm_url": track.get("url", ""),
                "youtube_search": f"https://www.youtube.com/results?search_query={track.get('name', '')} {artist_name or ''}"
            })
        
        return result
    
    except Exception as e:
        print(f"Error getting recommendations: {e}")
        return []