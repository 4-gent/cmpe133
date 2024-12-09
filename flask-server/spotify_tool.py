import os
from spotipy import Spotify
from spotipy.oauth2 import SpotifyClientCredentials

class SpotifyTool:
    def __init__(self, client_id, client_secret):
        self.spotify = Spotify(
            client_credentials_manager=SpotifyClientCredentials(
                client_id=client_id,
                client_secret=client_secret
            )
        )

    def search_music(self, query: str, type: str = "track"):
        results = self.spotify.search(q=query, type=type)
        return results["tracks"]["items"]
