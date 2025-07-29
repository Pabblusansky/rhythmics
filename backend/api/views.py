from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
import os
import requests
import base64

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

        # 3. Prepare authorization header (Client ID + Client Secret)
        client_id = os.getenv('SPOTIFY_CLIENT_ID')
        client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
        headers = {
            'Authorization': f'Basic {auth_header}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        response = requests.post(token_url, data=payload, headers=headers)
        if response.status_code != 200:
            return Response({"error": "Failed to retrieve access token", "details": response.json()}, status=response.status_code)

        token_data = response.json()
        
        # TODO: Save tokens (access_token, refresh_token) in the database, linking them to the user.
        request.session['spotify_access_token'] = token_data.get('access_token')
        request.session['spotify_refresh_token'] = token_data.get('refresh_token')
        request.session['spotify_token_expires_at'] = token_data.get('expires_in')

        # Redirect to the frontend
        return redirect('http://127.0.0.1:4200/dashboard') 
class UserProfile(APIView):
    def get(self, request, *args, **kwargs):
        access_token = request.session.get('spotify_access_token')
        if not access_token:
            return Response({"error": "Not authenticated"}, status=401)
        
        user_profile_url = 'https://api.spotify.com/v1/me'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        
        response = requests.get(user_profile_url, headers=headers)
        
        if response.status_code != 200:
            return Response({"error": "Failed to retrieve user profile"}, status=response.status_code)
            
        return Response(response.json())
