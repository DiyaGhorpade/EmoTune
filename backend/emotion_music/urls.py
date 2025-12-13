from django.urls import path
from .views import emotion_music_recommend

urlpatterns = [
    path("emotion/recommend/", emotion_music_recommend),  
]
