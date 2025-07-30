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
})
export class TopGenresChartComponent implements OnInit {
  public pieChartData: ChartConfiguration['data'] | null = null;
  public pieChartType: ChartType = 'pie';

    public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return '';
          },
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.spotifyService.getTopGenresChartData().subscribe(data => {
      this.pieChartData = data;
    });
  }
}