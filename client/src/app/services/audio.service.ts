import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTrackId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private playerState = new BehaviorSubject<AudioPlayerState>({
    isPlaying: false,
    currentTrackId: null,
  });

  playerState$ = this.playerState.asObservable();

  constructor() {
    this.audio.addEventListener('ended', () => this.stop());
  }

  playTrack(trackId: string, previewUrl: string): void {
    console.log('AudioService: Playing track', trackId, previewUrl);
    
    const currentState = this.playerState.getValue();

    if (currentState.isPlaying && currentState.currentTrackId === trackId) {
      console.log('AudioService: Pausing current track');
      this.pause();
    } else {
      console.log('AudioService: Starting new track');
      
      if (currentState.isPlaying) {
        this.stop();
      }
      
      this.audio.src = previewUrl;
      this.audio.load(); 
      
      this.audio.play().then(() => {
        console.log('AudioService: Playback started successfully');
        this.playerState.next({
          isPlaying: true,
          currentTrackId: trackId,
        });
      }).catch(error => {
        console.error('AudioService: Playback failed:', error);
        this.playerState.next({
          isPlaying: false,
          currentTrackId: null,
        });
      });
    }
  }

  pause(): void {
    this.audio.pause();
    this.playerState.next({
      ...this.playerState.getValue(),
      isPlaying: false,
    });
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.playerState.next({
      isPlaying: false,
      currentTrackId: null,
    });
  }
}