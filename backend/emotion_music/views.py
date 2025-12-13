import os
import uuid
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services.music_service import (
    predict_emotion_from_image,
    recommend_songs
)

# Create logs directory if it doesn't exist
logs_dir = os.path.join(settings.BASE_DIR, "logs")
os.makedirs(logs_dir, exist_ok=True)
log_file = os.path.join(logs_dir, "api.log")

def log_message(message):
    with open(log_file, "a") as f:
        f.write(f"{message}\n")
    print(message)  # Also print to console

@api_view(["GET","POST"])
def emotion_music_recommend(request):
    """
    Accepts an image
    Returns predicted emotion + song recommendations
    """
    log_message("Received request to emotion_music_recommend")

    if "image" not in request.FILES:
        log_message("No image in request.FILES")
        return Response(
            {"error": "No image file provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    image = request.FILES["image"]
    log_message(f"Received image: {image.name}, size: {image.size}")

    # Ensure temp directory exists
    temp_dir = os.path.join(settings.BASE_DIR, "temp")
    os.makedirs(temp_dir, exist_ok=True)

    # Save image temporarily
    filename = f"{uuid.uuid4()}.jpg"
    image_path = os.path.join(temp_dir, filename)

    with open(image_path, "wb+") as f:
        for chunk in image.chunks():
            f.write(chunk)

    log_message(f"Saved image to {image_path}")

    try:
        # 🔮 Emotion prediction
        emotion, confidence = predict_emotion_from_image(image_path)
        log_message(f"Predicted emotion: {emotion}, confidence: {confidence}")

        # 🎵 Song recommendations
        songs = recommend_songs(emotion)
        log_message(f"Recommended {len(songs)} songs: {[song['title'] for song in songs]}")

        response_data = {
            "emotion": emotion,
            "confidence": confidence,
            "recommendations": songs
        }
        log_message(f"Response data: {response_data}")
        
        return Response(response_data)

    except Exception as e:
        log_message(f"Error in processing: {e}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    finally:
        # Clean up temp file
        if os.path.exists(image_path):
            os.remove(image_path)
            log_message(f"Cleaned up {image_path}")
