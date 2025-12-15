import requests 
from app.core.config import LASTFM_API_KEY

MOOD_MAP = {
"happy": ["happy", "dance", "pop"],
"sad": ["sad", "acoustic", "melancholic"],
"angry": ["rock", "metal"],
"neutral": ["chill", "ambient"],
"fear": ["calm", "soothing"],
"surprise": ["upbeat", "indie"],
"disgust": ["dark", "industrial"]
}

def get_music(emotion):
    tracks = []
    for tag in MOOD_MAP.get(emotion, []):
        r = requests.get(
            "http://ws.audioscrobbler.com/2.0/",
            params={
            "method": "tag.gettoptracks",
            "tag": tag,
            "api_key": LASTFM_API_KEY,
            "format": "json",
                "limit": 5
            }
        )
        if r.status_code == 200:
            tracks.extend(r.json()["tracks"]["track"])
        return tracks