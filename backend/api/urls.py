from django.urls import path
from .views import SpotifyCallback, SpotifyLogin, TopGenres, TopTracks, UserProfile, TopTracks
urlpatterns = [
    path('auth/spotify/login', SpotifyLogin.as_view(), name='spotify-login'),
    path('auth/spotify/callback', SpotifyCallback.as_view(), name='spotify-callback'),
    path('me', UserProfile.as_view(), name='user-profile'),
    path('top-tracks', TopTracks.as_view(), name='top-tracks'),
    path('top-genres', TopGenres.as_view(), name='top-genres'),
]