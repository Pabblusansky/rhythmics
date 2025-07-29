from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
import os
import requests
import base64
from django.contrib.auth import login
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User
from .models import SpotifyToken
class SpotifyLogin(APIView):
    def get(self, request, *args, **kwargs):
        
        auth_params = {
            'response_type': 'code',
            'client_id': os.getenv('SPOTIFY_CLIENT_ID'),
            'scope': 'user-read-private user-read-email user-top-read playlist-read-private',
            'redirect_uri': 'http://127.0.0.1:8000/api/auth/spotify/callback'
        }

        params_string = '&'.join([f"{key}={value}" for key, value in auth_params.items()])
        
        auth_url = f"https://accounts.spotify.com/authorize?{params_string}"
        
        return redirect(auth_url)
    
class SpotifyCallback(APIView):
    def get(self, request, *args, **kwargs):
        auth_code = request.GET.get('code')
        if not auth_code:
            return Response({"error": "Authorization code not provided"}, status=400)

        token_url = 'https://accounts.spotify.com/api/token'
        payload = {
            'grant_type': 'authorization_code',
            'code': auth_code,
            'redirect_uri': 'http://127.0.0.1:8000/api/auth/spotify/callback'
        }
        client_id = os.getenv('SPOTIFY_CLIENT_ID')
        client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        auth_header_str = f"{client_id}:{client_secret}"
        auth_header_b64 = base64.b64encode(auth_header_str.encode()).decode()
        headers = {'Authorization': f'Basic {auth_header_b64}', 'Content-Type': 'application/x-www-form-urlencoded'}
        
        token_response = requests.post(token_url, data=payload, headers=headers)
        if token_response.status_code != 200:
            return Response({"error": "Failed to retrieve access token", "details": token_response.json()}, status=token_response.status_code)
        
        token_data = token_response.json()
        access_token = token_data.get('access_token')
        refresh_token = token_data.get('refresh_token')
        expires_in = token_data.get('expires_in')

        user_info_url = 'https://api.spotify.com/v1/me'
        user_headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get(user_info_url, headers=user_headers)
        user_data = user_response.json()
        spotify_id = user_data.get('id')

        django_user, created = User.objects.get_or_create(username=spotify_id)

        expires_at = timezone.now() + timedelta(seconds=expires_in)
        
        SpotifyToken.objects.update_or_create(
            user=django_user,
            defaults={
                'spotify_id': spotify_id,
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_at': expires_at,
            }
        )

        #  LOGIN 
        login(request, django_user)

        return redirect('http://127.0.0.1:4200/dashboard')

class UserProfile(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error": "Not authenticated"}, status=401)
        
        try:
            token = request.user.spotifytoken.access_token
        except SpotifyToken.DoesNotExist:
            return Response({"error": "Spotify token not found for this user"}, status=404)

        user_profile_url = 'https://api.spotify.com/v1/me'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        
        response = requests.get(user_profile_url, headers=headers)
        
        if response.status_code != 200:
            return Response({"error": "Failed to retrieve user profile"}, status=response.status_code)
            
        return Response(response.json())

class TopTracks(APIView):
    def get(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({"error": "Not authenticated"}, status=401)
        
        try:
            # TODO: Check if the token is expired and refresh it if necessary
            token = request.user.spotifytoken.access_token
        except SpotifyToken.DoesNotExist:
            return Response({"error": "Spotify token not found for this user"}, status=404)

        spotify_api_url = 'https://api.spotify.com/v1/me/top/tracks'
        headers = {
            'Authorization': f'Bearer {token}'
        }
        params = {
            'time_range': 'short_term', # short_term, medium_term, long_term
            'limit': 5
        }

        response = requests.get(spotify_api_url, headers=headers, params=params)

        if response.status_code != 200:
            return Response({"error": "Failed to retrieve top tracks", "details": response.json()}, status=response.status_code)
        
        return Response(response.json())