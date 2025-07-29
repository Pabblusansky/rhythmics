
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { SpotifyService } from '../services/spotify.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  userProfile: any;

  constructor(private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.spotifyService.getUserProfile().subscribe(
      (data) => {
        console.log('Data of the user:', data);
        this.userProfile = data;
      },
      (error) => {
        console.error('Error fetching user profile:', error);
      }
    );
  }
}