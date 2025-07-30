import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getTopTracks(): Observable<any> {
    return this.http.get(`${this.backendUrl}/top-tracks`, { withCredentials: true });
  }
        
  getTopGenresChartData(): Observable<any> {
    return this.http.get(`${this.backendUrl}/top-genres`, { withCredentials: true });
  }
    
}