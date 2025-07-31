import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopGenresChartComponent } from '../../components/charts/top-genres-chart/top-genres-chart';
import { SpotifyService } from '../../services/spotify.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PrivacyNoticeComponent } from '../../components/privacy-notice/privacy-notice'; // Add this

interface GenreData {
  name: string;
  count: number;
  percentage: number;
}

interface MusicInsight {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-genres',
  standalone: true,
  imports: [
    CommonModule, 
    TopGenresChartComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    PrivacyNoticeComponent // Add this
  ],
  templateUrl: './genres.html',
  styleUrl: './genres.scss'
})
export class Genres implements OnInit {
  @ViewChild(TopGenresChartComponent) chartComponent!: TopGenresChartComponent;
  
  topGenresList: GenreData[] = [];
  totalGenres = 0;
  topGenre = '';
  diversityScore = 0;
  musicInsights: MusicInsight[] = [];
  isLoading = true;
  isPrivacyBlocked = false; // Add this

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.checkPrivacySettings();
    if (!this.isPrivacyBlocked) {
      this.fetchGenresData();
    } else {
      this.isLoading = false;
    }
  }

  private checkPrivacySettings(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    this.isPrivacyBlocked = settings.showGenreAnalytics === false;
  }

  enableGenres(): void {
    const settings = JSON.parse(localStorage.getItem('rhythmics_privacy_settings') || '{}');
    settings.showGenreAnalytics = true;
    localStorage.setItem('rhythmics_privacy_settings', JSON.stringify(settings));
    
    this.isPrivacyBlocked = false;
    this.isLoading = true;
    this.fetchGenresData();
  }

  fetchGenresData(): void {
    this.isLoading = true;
    
    setTimeout(() => {
      this.spotifyService.getTopGenresChartData().subscribe({
        next: (data) => {
          console.log('Genres data received:', data); // Debug
          this.processGenresData(data);
          this.generateInsights();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching genres:', error);
          this.isLoading = false;
        }
      });
    }, 100);
  }

  private processGenresData(chartData: any): void {
    if (!chartData?.datasets?.[0]?.data) {
      console.warn('No chart data available');
      return;
    }

    const labels = chartData.labels || [];
    const data = chartData.datasets[0].data || [];
    const totalCount = data.reduce((sum: number, count: number) => sum + count, 0);

    this.topGenresList = labels.map((label: string, index: number) => ({
      name: label,
      count: data[index],
      percentage: Math.round((data[index] / totalCount) * 100)
    }));

    this.totalGenres = chartData.total_genres || labels.length;
    this.topGenre = labels[0] || 'Unknown';
    
    this.diversityScore = this.calculateDiversityScore();
    
    console.log(`Real genres count: ${this.totalGenres}`);
    console.log('Chart genres:', this.topGenresList.length);
  }

  private calculateDiversityScore(): number {
    if (this.totalGenres === 0) return 0;
    
    let score = 0;
    
    if (this.totalGenres >= 35) score += 5; 
    else if (this.totalGenres >= 25) score += 4;
    else if (this.totalGenres >= 18) score += 3;
    else if (this.totalGenres >= 12) score += 2;
    else score += 1;
    
    if (this.topGenresList.length > 0) {
      const topPercentage = this.topGenresList[0].percentage;
      
      if (topPercentage < 15) score += 5;
      else if (topPercentage < 25) score += 4;
      else if (topPercentage < 35) score += 3;
      else if (topPercentage < 45) score += 2;
      else score += 1;
    }
    
    return Math.min(10, score);
  }

  private generateInsights(): void {
    const insights: MusicInsight[] = [
      {
        icon: '🎨',
        title: 'Genre Explorer',
        description: `You listen to ${this.totalGenres} different genres across your favorite artists!`
      }
    ];

    if (this.topGenresList.length > 0) {
      insights.push({
        icon: '🎯',
        title: 'Main Preference', 
        description: `${this.topGenre} leads your taste with ${this.topGenresList[0]?.percentage}%, but you explore ${this.totalGenres - 1} other genres too!`
      });
    }

    // Insights for diversity score
    if (this.diversityScore >= 9) {
      insights.push({
        icon: '🦄',
        title: 'Music Chameleon',
        description: 'You\'re a rare musical shapeshifter - adapting to every genre with incredible diversity!'
      });
    } else if (this.diversityScore >= 7) {
      insights.push({
        icon: '🌊',
        title: 'Genre Surfer',
        description: 'You ride the waves of different musical styles like a pro - excellent balance!'
      });
    } else if (this.diversityScore >= 5) {
      insights.push({
        icon: '🎯',
        title: 'Balanced Explorer',
        description: 'You have solid preferences but keep your musical horizons open to new sounds.'
      });
    } else if (this.diversityScore >= 3) {
      insights.push({
        icon: '🏰',
        title: 'Genre Specialist',
        description: 'You\'ve built a strong musical fortress around your favorite genres!'
      });
    } else {
      insights.push({
        icon: '💎',
        title: 'Pure Loyalist',
        description: 'You know exactly what moves your soul and stick to it with unwavering dedication!'
      });
    }

    // Insights for top genres
    const topThreePercentage = this.topGenresList.slice(0, 3).reduce((sum, genre) => sum + genre.percentage, 0);
    if (topThreePercentage > 75) {
      insights.push({
        icon: '👑',
        title: 'Trinity Power',
        description: `Your top 3 genres dominate ${topThreePercentage}% of your musical kingdom!`
      });
    } else if (topThreePercentage < 40) {
      insights.push({
        icon: '🎪',
        title: 'Musical Carnival',
        description: 'No single genre dominates - your playlist is a colorful musical festival!'
      });
    }

    // Insights for niche genres
    const rareGenres = this.topGenresList.filter(g => g.percentage < 3);
    if (rareGenres.length >= 5) {
      insights.push({
        icon: '🔍',
        title: 'Underground Hunter',
        description: `${rareGenres.length} niche genres prove you\'re always digging for hidden musical treasures!`
      });
    }

    // Insights electronic vs acoustic
    const electronicGenres = this.topGenresList.filter(g => 
      g.name.toLowerCase().includes('electronic') || 
      g.name.toLowerCase().includes('edm') || 
      g.name.toLowerCase().includes('house') || 
      g.name.toLowerCase().includes('techno') ||
      g.name.toLowerCase().includes('dubstep') || 
      g.name.toLowerCase().includes('trance') ||
      g.name.toLowerCase().includes('drum and bass') ||
      g.name.toLowerCase().includes('synthwave')
    );
    
    if (electronicGenres.length >= 4) {
      insights.push({
        icon: '⚡',
        title: 'Digital Soul',
        description: 'Your heart beats in sync with electronic rhythms and synthetic soundscapes!'
      });
    }

    // Insights по rock/metal
    const rockGenres = this.topGenresList.filter(g => 
      g.name.toLowerCase().includes('rock') || 
      g.name.toLowerCase().includes('metal') ||
      g.name.toLowerCase().includes('punk') ||
      g.name.toLowerCase().includes('grunge')
    );
    
    if (rockGenres.length >= 3) {
      insights.push({
        icon: '🤘',
        title: 'Rock Warrior',
        description: 'You\'re powered by raw energy and the rebellious spirit of rock!'
      });
    }

    this.musicInsights = insights.slice(0, 4);
  }
}