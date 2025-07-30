import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard'; 
import { TopGenresChartComponent } from './components/charts/top-genres-chart/top-genres-chart';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Tracks } from './pages/tracks/tracks';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { 
    path: 'dashboard', 
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
      { path: 'profile', component: Profile },
      { path: 'genres', component: TopGenresChartComponent }, 
    { path: 'tracks', component: Tracks },
      // TODO: Add more routes for dashboard features (artists, tracks, etc.)
    ]
  },
];