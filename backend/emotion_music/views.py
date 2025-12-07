from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from .services.music_service import recommend_songs


@api_view(['GET'])
def health_check(request):
    return Response({"status": "EmoTune backend running"})


@api_view(['GET', 'POST'])
def analyze_and_recommend(request):
    emotion = (
        request.data.get("emotion") or
        request.query_params.get("emotion") or
        "surprise"
    )

    songs = recommend_songs(
        emotion=emotion,
        api_key=settings.LASTFM_API_KEY
    )

    return Response({
        "emotion": emotion,
        "songs": songs
    })