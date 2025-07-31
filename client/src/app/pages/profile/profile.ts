import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { DeleteConfirmationDialog } from '../../components/dialogue-delete/dialogue-delete.component';
import { PrivacySettingsDialogComponent } from '../../components/dialogue-privacy-settings/dialogue-privacy-settings';
import { PrivacySettings, DEFAULT_PRIVACY_SETTINGS } from '../../models/privacy-settings/privacy-settings.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile implements OnInit {
  userProfile: any;
  userPrivacySettings: PrivacySettings = DEFAULT_PRIVACY_SETTINGS;

  constructor(
    private spotifyService: SpotifyService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadPrivacySettings();
  }

  loadUserProfile(): void {
    this.spotifyService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      }
    });
  }

  refreshData(): void {
    console.log('Refreshing all data...');
    
    this.spotifyService.refreshAllData();
    
    this.snackBar.open('Refreshing your data...', 'Close', { duration: 2000 });
    
    this.loadUserProfile();
    
    setTimeout(() => {
      this.snackBar.open('All data refreshed! Navigate to other pages to see fresh data.', 'Close', { duration: 3000 });
    }, 2000);
  }

  openPrivacySettings(): void {
    const dialogRef = this.dialog.open(PrivacySettingsDialogComponent, {
      width: '650px',
      maxWidth: '90vw',
      data: { currentSettings: this.userPrivacySettings },
      panelClass: 'privacy-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userPrivacySettings = result;
        this.savePrivacySettings(result);
      }
    });
  }

  private savePrivacySettings(settings: PrivacySettings): void {
    localStorage.setItem('rhythmics_privacy_settings', JSON.stringify(settings));
    console.log('Privacy settings saved:', settings);
  }

  private loadPrivacySettings(): void {
    const saved = localStorage.getItem('rhythmics_privacy_settings');
    if (saved) {
      this.userPrivacySettings = { ...DEFAULT_PRIVACY_SETTINGS, ...JSON.parse(saved) };
    }
  }

  deleteData(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '520px',
      disableClose: true,
      panelClass: 'delete-dialog',
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete();
      }
    });
  }

  private performDelete(): void {
    this.spotifyService.deleteUserData().subscribe({
      next: () => {
        this.snackBar.open(
          'Account deleted successfully. Don\'t forget to remove Rhythmics from your Spotify Apps!', 
          'Close', 
          { duration: 5000 }
        );
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error deleting data:', error);
        this.snackBar.open('Failed to delete account', 'Close', { duration: 3000 });
      }
    });
  }
}