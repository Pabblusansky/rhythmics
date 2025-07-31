// client/src/app/components/privacy-notice/privacy-notice.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-privacy-notice',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="privacy-notice">
      <div class="notice-icon">
        <mat-icon>visibility_off</mat-icon>
      </div>
      <div class="notice-content">
        <h3>{{ title }} Hidden</h3>
        <p>{{ message }}</p>
        <button mat-raised-button class="enable-btn" (click)="onEnableClick()">
          <mat-icon>settings</mat-icon>
          Enable in Privacy Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .privacy-notice {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: rgba(255, 193, 7, 0.1);
      border: 1px solid rgba(255, 193, 7, 0.3);
      border-radius: 12px;
      margin: 20px 0;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 193, 7, 0.15);
        border-color: rgba(255, 193, 7, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 193, 7, 0.2);
      }
      
      .notice-icon {
        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
          color: #FFC107;
          animation: pulse 2s infinite;
        }
      }
      
      .notice-content {
        flex: 1;
        
        h3 {
          margin: 0 0 8px 0;
          color: #FFC107;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        p {
          margin: 0 0 16px 0;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.5;
          font-size: 1rem;
        }
        
        .enable-btn {
          background: linear-gradient(45deg, #FFC107, #FF9800) !important;
          color: #000 !important;
          border: none !important;
          font-weight: 600;
          transition: all 0.3s ease;
          
          &:hover {
            background: linear-gradient(45deg, #FF9800, #F57C00) !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
          }
          
          mat-icon {
            margin-right: 8px;
          }
        }
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class PrivacyNoticeComponent {
  @Input() title: string = 'Content';
  @Input() message: string = 'This content is hidden due to your privacy settings.';
  @Output() enableClick = new EventEmitter<void>();
  
  onEnableClick(): void {
    this.enableClick.emit();
  }
}