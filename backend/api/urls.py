from django.urls import path
from .views import SpotifyCallback, SpotifyLogin, UserProfile 

urlpatterns = [
    path('auth/spotify/login', SpotifyLogin.as_view(), name='spotify-login'),
    path('auth/spotify/callback', SpotifyCallback.as_view(), name='spotify-callback'),
    path('me', UserProfile.as_view(), name='user-profile'),
]