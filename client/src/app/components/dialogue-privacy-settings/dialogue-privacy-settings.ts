import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { PrivacySettings } from '../../models/privacy-settings/privacy-settings.interface';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-privacy-settings-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule
  ],
  template: `
    <div class="privacy-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>
          <mat-icon>privacy_tip</mat-icon>
          Privacy Settings
        </h2>
        <p>Control how your Rhythmics data is displayed and stored</p>
      </div>

      <div mat-dialog-content class="dialog-content">
        <!-- Data Display Settings -->
        <div class="setting-group">
          <h3>Data Display</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Show Top Tracks</label>
              <p>Display your most played tracks in analytics</p>
            </div>
            <mat-slide-toggle [(ngModel)]="settings.showTopTracks" color="primary"></mat-slide-toggle>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Show Top Artists</label>
              <p>Display your favorite artists in analytics</p>
            </div>
            <mat-slide-toggle [(ngModel)]="settings.showTopArtists" color="primary"></mat-slide-toggle>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Show Genre Analytics</label>
              <p>Display detailed genre breakdown and insights</p>
            </div>
            <mat-slide-toggle [(ngModel)]="settings.showGenreAnalytics" color="primary"></mat-slide-toggle>
          </div>
        </div>

        <!-- Data Storage Settings -->
        <div class="setting-group">
          <h3>Data Management</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Store Listening History</label>
              <p>Keep local cache of your listening patterns for faster analytics</p>
            </div>
            <mat-slide-toggle [(ngModel)]="settings.storeListeningHistory" color="primary" (change)="onCacheToggleChange()"></mat-slide-toggle>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <label>Data Retention</label>
              <p>How long to keep your cached data</p>
            </div>
            <mat-select [(ngModel)]="settings.dataRetentionDays" class="retention-select">
              <mat-option [value]="30">30 days</mat-option>
              <mat-option [value]="90">90 days</mat-option>
              <mat-option [value]="180">6 months</mat-option>
              <mat-option [value]="365">1 year</mat-option>
            </mat-select>
          </div>
        </div>

        <!-- Cache Information -->
        <div class="setting-group" *ngIf="settings.storeListeningHistory">
          <h3>Cache Information</h3>
          <div class="cache-stats">
            <div class="cache-stat">
              <span class="label">Cached Items:</span>
              <span class="value">{{ cacheStats.totalItems }}</span>
            </div>
            <div class="cache-stat">
              <span class="label">Cache Size:</span>
              <span class="value">{{ cacheStats.totalSize }} KB</span>
            </div>
            <div class="cache-stat" *ngIf="cacheStats.oldestItem">
              <span class="label">Oldest Item:</span>
              <span class="value">{{ getOldestItemAge() }}</span>
            </div>
          </div>
          
          <div class="cache-actions" *ngIf="cacheStats.totalItems > 0">
            <button mat-button [matMenuTriggerFor]="cacheMenu" class="cache-menu-btn">
              <mat-icon>more_vert</mat-icon>
              Cache Actions
            </button>
            
            <mat-menu #cacheMenu="matMenu">
              <button mat-menu-item (click)="clearOldCache()">
                <mat-icon>schedule</mat-icon>
                Clear Old Cache (24h+)
              </button>
              <button mat-menu-item (click)="clearCache()">
                <mat-icon>clear_all</mat-icon>
                Clear All Cache
              </button>
            </mat-menu>
          </div>
        </div>

        <!-- External Links -->
        <div class="setting-group">
          <h3>Spotify Privacy</h3>
          <p class="spotify-info">To manage your Spotify account privacy settings:</p>
          <a href="https://www.spotify.com/account/privacy/" target="_blank" class="spotify-link">
            <mat-icon>open_in_new</mat-icon>
            Open Spotify Privacy Settings
          </a>
        </div>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()">
          <mat-icon>save</mat-icon>
          Save Settings
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./dialogue-privacy-settings.scss'],
})
export class PrivacySettingsDialogComponent {
  settings: PrivacySettings;
  cacheStats = { totalItems: 0, totalSize: 0, oldestItem: null as number | null };

  constructor(
    public dialogRef: MatDialogRef<PrivacySettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentSettings: PrivacySettings },
    private cacheService: CacheService 
  ) {
    this.settings = { ...data.currentSettings };
    this.loadCacheStats();
  }

  loadCacheStats(): void {
    this.cacheStats = this.cacheService.getCacheStats();
  }

  clearCache(): void {
    this.cacheService.clear();
    this.loadCacheStats();
  }

  clearOldCache(): void {
    this.cacheService.clearOldCache(24);
    this.loadCacheStats();
  }

  onCacheToggleChange(): void {
    // If user disables caching, clear existing cache
    if (!this.settings.storeListeningHistory) {
      this.clearCache();
    }
  }

  getOldestItemAge(): string {
    if (!this.cacheStats.oldestItem) return 'N/A';
    
    const ageInHours = (Date.now() - this.cacheStats.oldestItem) / (1000 * 60 * 60);
    if (ageInHours < 1) return 'Less than 1 hour';
    if (ageInHours < 24) return `${Math.round(ageInHours)} hours`;
    return `${Math.round(ageInHours / 24)} days`;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // If user disabled caching, clear all cache
    if (!this.settings.storeListeningHistory) {
      this.cacheService.clear();
    }
    
    this.dialogRef.close(this.settings);
  }
}