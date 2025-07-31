import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../services/spotify.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

interface Artist {
  id: string;
  name: string;
  image_url: string;
  popularity: number;
  genres: string[];
  spotify_url: string;
  followers: number;
  rank: number;
}

@Component({
  selector: 'app-artists',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonToggleModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './artists.html',
  styleUrls: ['./artists.scss']
})
export class Artists implements OnInit {
  topArtists: Artist[] = [];
  selectedTimeRange = 'medium_term';
  isLoading = false;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.fetchTopArtists();
  }

  fetchTopArtists(): void {
    this.isLoading = true;
    this.spotifyService.getTopArtists(this.selectedTimeRange, 50).subscribe({
      next: (data) => {
        this.topArtists = data.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching artists:', error);
        this.isLoading = false;
      }
    });
  }

  onTimeRangeChange(event: any): void {
    this.selectedTimeRange = event.value;
    this.fetchTopArtists();
  }

  openInSpotify(artist: Artist): void {
    if (artist.spotify_url) {
      window.open(artist.spotify_url, '_blank');
    }
  }

  formatFollowers(followers: number): string {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(0)}K`;
    }
    return followers.toString();
  }

  getGenreDisplay(genres: string[]): string {
    return genres.length > 0 ? genres.join(', ') : 'No genres available';
  }
}