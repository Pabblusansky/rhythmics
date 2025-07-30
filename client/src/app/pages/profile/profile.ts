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
import { DeleteConfirmationDialog } from '../../components/dialogues/dialogue-delete.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: any;

  constructor(
    private spotifyService: SpotifyService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
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
    this.snackBar.open('Refreshing your data...', 'Close', { duration: 2000 });
    this.loadUserProfile();
  }

  openPrivacySettings(): void {
    this.snackBar.open('Privacy settings coming soon!', 'Close', { duration: 3000 });
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