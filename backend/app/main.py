from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.services.inference import predict_emotion
from app.services.music_service import get_music

app=FastAPI()

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_methods=["*"],
allow_headers=["*"],
)

@app.post("/emotion")
async def emotion_endpoint(image: UploadFile = File(...)):
    emotion, confidence = await predict_emotion(image)
    songs = get_music(emotion)


    return {
        "emotion": emotion,
        "confidence": confidence,
        "songs": songs
}