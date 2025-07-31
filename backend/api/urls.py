from django.urls import path
from .views import DeleteUserData, LogoutUser, SpotifyCallback, SpotifyLogin, TopArtists, TopGenres, TopTracks, UserProfile, TopTracks
urlpatterns = [
    path('auth/spotify/login', SpotifyLogin.as_view(), name='spotify-login'),
    path('auth/spotify/callback', SpotifyCallback.as_view(), name='spotify-callback'),
    path('me', UserProfile.as_view(), name='user-profile'),
    path('top-tracks', TopTracks.as_view(), name='top-tracks'),
    path('top-genres', TopGenres.as_view(), name='top-genres'),
    path('top-artists', TopArtists.as_view(), name='top-artists'),
    path('logout', LogoutUser.as_view(), name='logout'),
    path('delete-data', DeleteUserData.as_view(), name='delete-data')
]