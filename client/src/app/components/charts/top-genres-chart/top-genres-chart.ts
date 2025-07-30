import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
import { SpotifyService } from '../../../services/spotify.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-top-genres-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './top-genres-chart.html',
  styleUrls: ['./top-genres-chart.scss']
})
export class TopGenresChartComponent implements OnInit {
  public pieChartData: ChartConfiguration<'doughnut'>['data'] | null = null;
  public pieChartType: ChartType = 'doughnut'; 
  public isLoading = true;

  public pieChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            family: 'Roboto'
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#1DB954',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: function(context) {
            return '';
          },
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = Math.round((Number(value) / total) * 100);
            return `${label}: ${value} artists (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    }
  };

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  private loadChartData(): void {
    this.isLoading = true;
    this.spotifyService.getTopGenresChartData().subscribe({
      next: (data) => {
        this.setupChartData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.isLoading = false;
      }
    });
  }

  private setupChartData(data: any): void {
    if (!data || !data.labels || !data.datasets?.[0]?.data) {
      console.warn('Invalid chart data received');
      return;
    }

    const colors = [
      '#1DB954', // Spotify Green
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#96CEB4', // Mint
      '#FECA57', // Yellow
      '#FF9FF3', // Pink
      '#54A0FF', // Light Blue
      '#5F27CD', // Purple
      '#FF9F43', // Orange
      '#00D2D3', // Cyan
      '#C44569'  // Dark Pink
    ];

    this.pieChartData = {
      labels: data.labels,
      datasets: [{
        data: data.datasets[0].data,
        backgroundColor: colors.slice(0, data.labels.length),
        hoverBackgroundColor: colors.slice(0, data.labels.length).map(color => 
          this.lightenColor(color, 20)
        ),
        borderWidth: 2,
        borderColor: '#2c2c2c',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff'
      }]
    };
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
}