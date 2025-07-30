import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2>Delete Account</h2>
      </div>
      
      <div class="dialog-content">
        <p class="main-text">Are you sure you want to delete your Rhythmics account?</p>
        
        <div class="info-box">
          <mat-icon class="info-icon">info</mat-icon>
          <div class="info-text">
            <strong>Important:</strong> This only removes your data from Rhythmics. 
            To fully disconnect from Spotify, visit 
            <a href="https://www.spotify.com/account/apps/" target="_blank" class="spotify-link">
              spotify.com/account/apps/
            </a> and remove Rhythmics from your connected apps.
          </div>
        </div>
        
        <p class="warning-text">⚠️ This action cannot be undone.</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-button class="cancel-btn" (click)="cancel()">
          Cancel
        </button>
        <button mat-raised-button class="delete-btn" (click)="confirm()">
          <mat-icon>delete_forever</mat-icon>
          Delete Account
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 32px;
      max-width: 520px;
      background: linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%);
      color: #ffffff;
      border-radius: 16px;
      border: 1px solid rgba(244, 67, 54, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      position: relative;
      overflow: hidden;
    }
    
    .dialog-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f44336, #ff5722, #f44336);
      border-radius: 16px 16px 0 0;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      
      .warning-icon {
        color: #FF9800;
        font-size: 2.5rem;
        width: 40px;
        height: 40px;
        background: rgba(255, 152, 0, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 2s ease-in-out infinite;
      }
      
      h2 {
        margin: 0;
        color: #ffffff;
        font-weight: 600;
        font-size: 1.5rem;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.4);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(255, 152, 0, 0);
      }
    }
    
    .dialog-content {
      margin-bottom: 32px;
      
      .main-text {
        color: rgba(255, 255, 255, 0.9);
        line-height: 1.6;
        margin-bottom: 20px;
        font-size: 1.1rem;
      }
      
      .warning-text {
        color: #f44336;
        font-size: 1.1rem;
        font-weight: 600;
        margin: 20px 0 0 0;
        text-align: center;
        padding: 12px;
        background: rgba(244, 67, 54, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(244, 67, 54, 0.3);
      }
      
      .info-box {
        display: flex;
        gap: 16px;
        background: rgba(33, 150, 243, 0.1);
        border: 1px solid rgba(33, 150, 243, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        backdrop-filter: blur(10px);
        
        .info-icon {
          color: #2196F3;
          margin-top: 2px;
          flex-shrink: 0;
          font-size: 1.5rem;
        }
        
        .info-text {
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.5;
          flex: 1;
          
          strong {
            color: #ffffff;
            display: block;
            margin-bottom: 8px;
          }
        }
        
        .spotify-link {
          color: #1DB954;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 2px 4px;
          border-radius: 4px;
          
          &:hover {
            color: #1ed760;
            background: rgba(29, 185, 84, 0.1);
            text-decoration: underline;
          }
        }
      }
    }
    
    .dialog-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      
      .cancel-btn {
        min-width: 120px;
        height: 48px;
        border-radius: 24px;
        color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.5);
        }
      }
      
      .delete-btn {
        min-width: 140px;
        height: 48px;
        border-radius: 24px;
        background: linear-gradient(45deg, #f44336, #d32f2f);
        color: #ffffff;
        border: none;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(244, 67, 54, 0.3);
        
        &:hover {
          background: linear-gradient(45deg, #d32f2f, #b71c1c);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(244, 67, 54, 0.4);
        }
        
        &:active {
          transform: translateY(0);
        }
        
        mat-icon {
          margin-right: 8px;
        }
      }
    }
  `]
})
export class DeleteConfirmationDialog {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationDialog>
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}