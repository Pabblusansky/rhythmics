import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrivacyNoticeComponent } from '../../components/privacy-notice/privacy-notice';
import { MatDivider } from "@angular/material/divider";
import { interval, Subscription } from 'rxjs';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from '@angular/forms';

interface RecentlyPlayedTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    image_url: string;
  };
  duration_ms: number;
  played_at: string;
  spotify_url: string;
  popularity: number;
}

@Component({
  selector: 'app-recently-played',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    PrivacyNoticeComponent,
    MatDivider,
    MatButtonToggleModule,
    FormsModule
],
  templateUrl: './recently-played.html',
  styleUrls: ['./recently-played.scss']
})
export class RecentlyPlayed implements OnInit, OnDestroy {
  recentTracks: RecentlyPlayedTrack[] = [];
  currentTrack: any = null;
  isCurrentlyPlaying = false;
  isLoading = false;
  isPrivacyBlocked = false;
  
  private autoRefreshSubscription?: Subscription;
  private progressUpdateSubscription?: Subscription;
  autoRefreshEnabled = true;
  nextRefreshIn = 30;
  
  localProgressMs = 0;
  lastProgressUpdate = 0;

  filteredTracks: RecentlyPlayedTrack[] = [];
  selectedTimeFilter = 'all';
  timeFilters = [
    { value: 'all', label: 'All Time', hours: null },
    { value: '1h', label: 'Last Hour', hours: 1 },
    { value: '6h', label: 'Last 6 Hours', hours: 6 },
    { value: '24h', label: 'Last 24 Hours', hours: 24 },
    { value: '7d', label: 'Last 7 Days', hours: 168 }
  ];

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.checkPrivacySettings();
    if (!this.isPrivacyBlocked) {
      this.fetchRecentlyPlayed();
      this.fetchCurrentlyPlaying();
      this.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
    this.stopProgressUpdates();
  }

  private checkPrivacySettings(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    this.isPrivacyBlocked = settings.showRecentlyPlayed === false;
  }

  startAutoRefresh(): void {
    if (!this.autoRefreshEnabled) return;
    
    this.stopAutoRefresh();
    
    this.autoRefreshSubscription = interval(1000).subscribe(() => {
      this.nextRefreshIn--;
      
      if (this.nextRefreshIn <= 0) {
        this.fetchCurrentlyPlaying();
        this.nextRefreshIn = 30;
      }
    });
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = undefined;
    }
  }

  startProgressUpdates(): void {
    if (!this.currentTrack || !this.isCurrentlyPlaying) return;
    
    this.stopProgressUpdates();
    
    this.progressUpdateSubscription = interval(1000).subscribe(() => {
      if (this.currentTrack && this.isCurrentlyPlaying && this.currentTrack.progress_ms) {
        this.localProgressMs += 1000;
        
        if (this.localProgressMs >= this.currentTrack.duration_ms) {
          this.localProgressMs = this.currentTrack.duration_ms;
          this.stopProgressUpdates();
          this.fetchCurrentlyPlaying();
        }
      }
    });
  }

  stopProgressUpdates(): void {
    if (this.progressUpdateSubscription) {
      this.progressUpdateSubscription.unsubscribe();
      this.progressUpdateSubscription = undefined;
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefreshEnabled = !this.autoRefreshEnabled;
    
    if (this.autoRefreshEnabled) {
      this.nextRefreshIn = 30;
      this.startAutoRefresh();
      if (this.isCurrentlyPlaying && this.currentTrack) {
        this.startProgressUpdates();
      }
    } else {
      this.stopAutoRefresh();
      this.stopProgressUpdates();
    }
  }

  enableRecentlyPlayed(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    settings.showRecentlyPlayed = true;
    localStorage.setItem('rhythmics_privacy_settings', JSON.stringify(settings));
    
    this.isPrivacyBlocked = false;
    this.fetchRecentlyPlayed();
    this.fetchCurrentlyPlaying();
    this.startAutoRefresh();
  }

  fetchRecentlyPlayed(forceRefresh: boolean = false): void {
    this.isLoading = true;
    this.spotifyService.getRecentlyPlayed(forceRefresh).subscribe({
      next: (data) => {
        this.recentTracks = data.items;
        this.applyTimeFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching recently played:', error);
        this.isLoading = false;
        
        if (error.status === 403) {
          alert('Please re-authorize the application to access your recently played tracks. Click Profile -> Privacy Settings to refresh permissions.');
        }
      }
    });
  }

  applyTimeFilter(): void {
    if (this.selectedTimeFilter === 'all') {
      this.filteredTracks = [...this.recentTracks];
      return;
    }

    const filter = this.timeFilters.find(f => f.value === this.selectedTimeFilter);
    if (!filter || !filter.hours) {
      this.filteredTracks = [...this.recentTracks];
      return;
    }

    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - filter.hours);

    this.filteredTracks = this.recentTracks.filter(track => {
      const playedTime = new Date(track.played_at);
      return playedTime >= cutoffTime;
    });
  }

  onTimeFilterChange(event: any): void {
    this.selectedTimeFilter = event.value;
    this.applyTimeFilter();
  }

  getFilteredTracksCount(): number {
    return this.filteredTracks.length;
  }

  fetchCurrentlyPlaying(): void {
    this.spotifyService.getCurrentlyPlaying().subscribe({
      next: (data) => {
        const wasPlaying = this.isCurrentlyPlaying;
        const wasTrack = this.currentTrack?.id;
        
        this.isCurrentlyPlaying = data.is_playing;
        this.currentTrack = data.item;
        
        if (this.currentTrack && this.currentTrack.progress_ms) {
          this.localProgressMs = this.currentTrack.progress_ms;
          this.lastProgressUpdate = Date.now();
        }
        
        if (this.isCurrentlyPlaying && this.currentTrack) {
          if (!wasPlaying || wasTrack !== this.currentTrack.id) {
            this.startProgressUpdates();
          }
        } else {
          this.stopProgressUpdates();
        }
      },
      error: (error) => {
        console.log('No track currently playing');
        this.isCurrentlyPlaying = false;
        this.currentTrack = null;
        this.stopProgressUpdates();
      }
    });
  }

  refreshData(): void {
    this.fetchRecentlyPlayed(true);
    this.fetchCurrentlyPlaying();
    this.nextRefreshIn = 30;
  }

  getArtistNames(artists: { name: string }[]): string {
    return artists.map(a => a.name).join(', ');
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatPlayedAt(playedAt: string): string {
    const playedTime = new Date(playedAt);
    const now = new Date();
    const diffInMs = now.getTime() - playedTime.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return playedTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: playedTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  openInSpotify(track: RecentlyPlayedTrack): void {
    if (track.spotify_url) {
      window.open(track.spotify_url, '_blank');
    }
  }

  trackByFn(index: number, item: RecentlyPlayedTrack): string {
    return item.id + item.played_at; 
  }

  // Progress bar methods
  getProgressPercentage(): number {
    if (!this.currentTrack || !this.currentTrack.duration_ms) {
      return 0;
    }
    
    const currentProgress = this.isCurrentlyPlaying ? this.localProgressMs : (this.currentTrack.progress_ms || 0);
    
    return Math.min((currentProgress / this.currentTrack.duration_ms) * 100, 100);
  }

  formatProgress(progressMs?: number): string {
    const progress = progressMs !== undefined ? progressMs : 
                   (this.isCurrentlyPlaying ? this.localProgressMs : (this.currentTrack?.progress_ms || 0));
    
    const minutes = Math.floor(progress / 60000);
    const seconds = Math.floor((progress % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getRemainingTime(): string {
    if (!this.currentTrack || !this.currentTrack.duration_ms) {
      return '0:00';
    }
    
    const currentProgress = this.isCurrentlyPlaying ? this.localProgressMs : (this.currentTrack.progress_ms || 0);
    const remaining = Math.max(this.currentTrack.duration_ms - currentProgress, 0);
    
    return this.formatProgress(remaining);
  }
}