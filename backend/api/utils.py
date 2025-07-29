from django.utils import timezone
from datetime import timedelta
from .models import SpotifyToken
import requests
import os
import base64

def is_token_expired(token_instance):
    return token_instance.expires_at <= timezone.now()

def refresh_spotify_token(token_instance):
    print("DEBUG: Token expired, refreshing...")
    
    refresh_token = token_instance.refresh_token
    
    token_url = 'https://accounts.spotify.com/api/token'
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
    auth_header_str = f"{client_id}:{client_secret}"
    auth_header_b64 = base64.b64encode(auth_header_str.encode()).decode()
    headers = {'Authorization': f'Basic {auth_header_b64}', 'Content-Type': 'application/x-www-form-urlencoded'}

    response = requests.post(token_url, data=payload, headers=headers)
    if response.status_code != 200:
        print(f"ERROR: Failed to refresh token. Status: {response.status_code}, Response: {response.json()}")
        return None

    new_token_data = response.json()
    token_instance.access_token = new_token_data.get('access_token')
    token_instance.refresh_token = new_token_data.get('refresh_token', refresh_token)
    token_instance.expires_at = timezone.now() + timedelta(seconds=new_token_data.get('expires_in'))
    token_instance.save(update_fields=['access_token', 'refresh_token', 'expires_at'])

    print("DEBUG: Token successfully refreshed.")
    return token_instance

def get_user_token(user):
    try:
        token_instance = user.spotifytoken
        if is_token_expired(token_instance):
            token_instance = refresh_spotify_token(token_instance)
        return token_instance.access_token if token_instance else None
    except SpotifyToken.DoesNotExist:
        return None