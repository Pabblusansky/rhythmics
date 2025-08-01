from django.urls import path
from .views import CurrentlyPlaying, DeleteUserData, LogoutUser, SpotifyCallback, SpotifyLogin, TopArtists, TopGenres, TopTracks, UserProfile, TopTracks, RecentlyPlayed

urlpatterns = [
    path('auth/spotify/login', SpotifyLogin.as_view(), name='spotify-login'),
    path('auth/spotify/callback', SpotifyCallback.as_view(), name='spotify-callback'),
    path('me', UserProfile.as_view(), name='user-profile'),
    path('top-tracks', TopTracks.as_view(), name='top-tracks'),
    path('top-genres', TopGenres.as_view(), name='top-genres'),
    path('top-artists', TopArtists.as_view(), name='top-artists'),
    path('recently-played', RecentlyPlayed.as_view(), name='recently-played'), 
    path('currently-playing', CurrentlyPlaying.as_view(), name='currently-playing'), 
    path('logout', LogoutUser.as_view(), name='logout'),
    path('delete-data', DeleteUserData.as_view(), name='delete-data')
]