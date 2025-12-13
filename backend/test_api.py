import requests

api_key = 'd62d093e865bd64f3871f304662ca647'
params = {
    'method': 'tag.gettoptracks',
    'tag': 'pop',
    'api_key': api_key,
    'format': 'json',
    'limit': 5
}
try:
    response = requests.get('http://ws.audioscrobbler.com/2.0/', params=params, timeout=10)
    print('Status:', response.status_code)
    data = response.json()
    print('Success:', 'tracks' in data)
    if 'tracks' in data:
        tracks = data['tracks']['track']
        print('Number of tracks:', len(tracks))
        for track in tracks[:2]:
            print(f"{track['name']} by {track['artist']['name']}")
except Exception as e:
    print('Error:', e)