import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
  
  sidenavOpened = true;
  
  navigationItems = [
    { 
      path: '/dashboard/profile', 
      icon: 'person', 
      label: 'Profile' 
    },
    { 
      path: '/dashboard/genres', 
      icon: 'pie_chart', 
      label: 'Genres' 
    },
    { 
      path: '/dashboard/tracks', 
      icon: 'queue_music', 
      label: 'Tracks' 
    },
    { 
      path: '/dashboard/artists', 
      icon: 'group', 
      label: 'Artists' 
    },
    {
      path: '/dashboard/recently-played',
      icon: 'history',
      label: 'Recently Played'
    }
  ];

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }

  logout(): void {
    this.spotifyService.logout().subscribe(() => {
      this.router.navigate(['/home']); 
    });
  }
}