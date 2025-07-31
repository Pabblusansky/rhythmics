import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private backendUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  getUserProfile() {
    return this.http.get(`${this.backendUrl}/me`, { withCredentials: true });
  }

  getTopTracks(timeRange: string = 'short_term', limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('time_range', timeRange)
      .set('limit', limit.toString());

    return this.http.get(`${this.backendUrl}/top-tracks`, { 
      withCredentials: true,
      params: params
    });
  }
        
  getTopArtists(timeRange: string = 'medium_term', limit: number = 50): Observable<any> {
    const params = new HttpParams()
      .set('time_range', timeRange)
      .set('limit', limit.toString());

    return this.http.get(`${this.backendUrl}/top-artists`, { 
      withCredentials: true,
      params: params
    });
  }
  
  getTopGenresChartData(): Observable<any> {
    return this.http.get(`${this.backendUrl}/top-genres`, { withCredentials: true });
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