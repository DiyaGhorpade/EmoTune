import os
from dotenv import load_dotenv
import requests

load_dotenv()


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