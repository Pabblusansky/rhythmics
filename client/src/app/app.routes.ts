import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProfileComponent } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard'; 
import { TopGenresChartComponent } from './components/charts/top-genres-chart/top-genres-chart';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { 
    path: 'dashboard', 
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
      { path: 'profile', component: ProfileComponent },
      { path: 'genres', component: TopGenresChartComponent }, 
      // TODO: Add more routes for dashboard features (artists, tracks, etc.)
    ]
  },
];