import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators'; 
import { CacheService } from './cache.service'; 
import { environment } from '../../environments/environment'; 
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private backendUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getUserProfile(): Observable<any> {
    const cacheKey = 'user_profile';
    
    // Check cache first
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    // If not in cache, fetch from API
    return this.http.get(`${this.backendUrl}/me`, { withCredentials: true }).pipe(
      tap(data => {
        // Cache for 6 hours
        this.cacheService.set(cacheKey, data, 6);
      })
    );
  }

  private shouldShowTopTracks(): boolean {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    return settings.showTopTracks !== false;
  }

  private shouldShowTopArtists(): boolean {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    return settings.showTopArtists !== false;
  }

  private shouldShowGenreAnalytics(): boolean {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    return settings.showGenreAnalytics !== false;
  }

  getTopTracks(timeRange: string = 'short_term', limit: number = 10): Observable<any> {
    if (!this.shouldShowTopTracks()) {
      return new Observable(observer => {
        observer.next({ items: [] });
        observer.complete();
      });
    }

    const cacheKey = `top_tracks_${timeRange}_${limit}`;
    
    // Check cache first
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('time_range', timeRange)
      .set('limit', limit.toString());

    return this.http.get(`${this.backendUrl}/top-tracks`, { 
      withCredentials: true,
      params: params
    }).pipe(
      tap(data => {
        // Cache for 2 hours
        this.cacheService.set(cacheKey, data, 2);
      })
    );
  }
        
  getTopArtists(timeRange: string = 'medium_term', limit: number = 50): Observable<any> {
    if (!this.shouldShowTopArtists()) {
      return new Observable(observer => {
        observer.next({ items: [] });
        observer.complete();
      });
    }

    const cacheKey = `top_artists_${timeRange}_${limit}`;
    
    // Check cache first
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    const params = new HttpParams()
      .set('time_range', timeRange)
      .set('limit', limit.toString());

    return this.http.get(`${this.backendUrl}/top-artists`, { 
      withCredentials: true,
      params: params
    }).pipe(
      tap(data => {
        // Cache for 2 hours
        this.cacheService.set(cacheKey, data, 2);
      })
    );
  }
  
  getTopGenresChartData(): Observable<any> {
    if (!this.shouldShowGenreAnalytics()) {
      return new Observable(observer => {
        observer.next({ genres: [] });
        observer.complete();
      });
    }

    const cacheKey = 'top_genres_chart';
    
    // Check cache first
    const cached = this.cacheService.get(cacheKey);
    if (cached) {
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    return this.http.get(`${this.backendUrl}/top-genres`, { withCredentials: true }).pipe(
      tap(data => {
        // Cache for 1 hour
        this.cacheService.set(cacheKey, data, 1);
      })
    );
  }

  
  private shouldShowRecentlyPlayed(): boolean {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    return settings.showRecentlyPlayed !== false;
  }

  getRecentlyPlayed(forceRefresh: boolean = false): Observable<any> {
    if (!this.shouldShowRecentlyPlayed()) {
      return new Observable(observer => {
        observer.next({ items: [] });
        observer.complete();
      });
    }

    const cacheKey = 'recently_played';
    
    if (!forceRefresh) {
      const cached = this.cacheService.get(cacheKey);
      if (cached) {
        return new Observable(observer => {
          observer.next(cached);
          observer.complete();
        });
      }
    }

    return this.http.get(`${this.backendUrl}/recently-played`, { withCredentials: true }).pipe(
      tap(data => {
        this.cacheService.set(cacheKey, data, 0.033);
      })
    );
  }
  
  getCurrentlyPlaying(): Observable<any> {
    return this.http.get(`${this.backendUrl}/currently-playing`, { withCredentials: true });
  }
  
  // Method to force refresh all data
  refreshAllData(): void {
    this.cacheService.clear();
    console.log('All cached data cleared - fresh data will be fetched');
  }
      
  deleteUserData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': this.getCsrfToken()
    });
    return this.http.post(`${this.backendUrl}/delete-data`, {}, { 
      withCredentials: true, 
      headers 
    });
  }
  
  logout(): Observable<any> {
    // Clear cache on logout
    this.cacheService.clear();
    return this.http.get(`${this.backendUrl}/logout`, { withCredentials: true });
  }

  private getCsrfToken(): string {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  }
}