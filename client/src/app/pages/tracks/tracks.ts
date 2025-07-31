import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
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
export class Tracks implements OnInit {
  topTracks: any[] = [];
  selectedTimeRange = 'short_term';
  isLoading = false;
  isPrivacyBlocked = false;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.checkPrivacySettings();
    if (!this.isPrivacyBlocked) {
      this.fetchTopTracks();
    }
  }

  private checkPrivacySettings(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    this.isPrivacyBlocked = settings.showTopTracks === false;
  }

  fetchTopTracks(): void {
    this.isLoading = true;
    this.spotifyService.getTopTracks(this.selectedTimeRange, 20).subscribe({
      next: (data) => {
        this.topTracks = data.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tracks:', error);
        this.isLoading = false;
      }
    });
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

  getArtistNames(artists: any[]): string {
    return artists.map(a => a.name).join(', ');
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  openInSpotify(track: any): void {
    if (track.external_urls?.spotify) {
      window.open(track.external_urls.spotify, '_blank');
    }
  }
}