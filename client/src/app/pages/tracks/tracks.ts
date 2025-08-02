import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { Subscription } from 'rxjs';
import { AudioPlayerState, AudioService } from '../../services/audio.service';
import { PrivacyNoticeComponent } from '../../components/privacy-notice/privacy-notice';

@Component({
  selector: 'app-tracks',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonToggleModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatButtonModule,
    MatTooltipModule,
    FormsModule,
    PrivacyNoticeComponent
  ],
  templateUrl: './tracks.html',
  styleUrls: ['./tracks.scss']
})
export class Tracks implements OnInit, OnDestroy {
  topTracks: any[] = [];
  selectedTimeRange = 'short_term';
  isLoading = false;
  isPrivacyBlocked = false;
  
  playerState: AudioPlayerState = { isPlaying: false, currentTrackId: null };
  private playerStateSubscription!: Subscription;

  constructor(
    private spotifyService: SpotifyService, 
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    this.checkPrivacySettings();
    if (!this.isPrivacyBlocked) {
      this.fetchTopTracks();
    }
    this.playerStateSubscription = this.audioService.playerState$.subscribe(state => {
      this.playerState = state;
    });
  }

  ngOnDestroy(): void {
    if (this.playerStateSubscription) {
      this.playerStateSubscription.unsubscribe();
    }
  }

  togglePlay(event: MouseEvent, track: any): void {
    event.stopPropagation();
    console.log('Toggle play clicked for track:', track.name);
    console.log('Has preview:', track.has_preview);
    console.log('Preview URL:', track.preview_url);
    
    if (track.has_preview && track.preview_url) {
      this.audioService.playTrack(track.id, track.preview_url);
    } else {
      console.warn('No preview available for this track:', track.name);
      alert(`Preview not available for "${track.name}". Opening in Spotify instead.`);
      this.openInSpotify(track);
    }
  }

  getArtistNames(artists: any[]): string {
    if (!artists || artists.length === 0) return 'Unknown Artist';
    return artists.map(artist => artist.name).join(', ');
  }

  formatDuration(durationMs: number): string {
    if (!durationMs) return '0:00';
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  openInSpotify(track: any): void {
    if (track.external_urls && track.external_urls.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    } else {
      console.warn('No Spotify URL available for this track');
    }
  }

  onTimeRangeChange(event: any): void {
    this.selectedTimeRange = event.value;
    this.fetchTopTracks();
  }

  enableTracks(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    settings.showTopTracks = true;
    localStorage.setItem('rhythmics_privacy_settings', JSON.stringify(settings));
    
    this.isPrivacyBlocked = false;
    this.fetchTopTracks();
  }

  private checkPrivacySettings(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    this.isPrivacyBlocked = settings.showTopTracks === false;
  }

  fetchTopTracks(): void {
    this.isLoading = true;
    
    this.spotifyService.getTopTracks(this.selectedTimeRange, 50).subscribe({
      next: (data) => {
        console.log('Fetched tracks:', data);
        this.topTracks = data.items || [];
        
        this.topTracks.forEach((track, index) => {
          // This is a simple check to see if the track has a preview URL, commented out because it's too noisy
          // console.log(`Track ${index + 1}: ${track.name} - Preview: ${track.preview_url ? 'YES' : 'NO'}`);
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching top tracks:', error);
        this.topTracks = [];
        this.isLoading = false;
      }
    });
  }

  getTracksWithPreviewCount(): number {
    return this.topTracks.filter(track => track.has_preview).length;
  }
}