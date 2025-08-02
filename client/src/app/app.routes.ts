import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard'; 
import { TopGenresChartComponent } from './components/charts/top-genres-chart/top-genres-chart';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Tracks } from './pages/tracks/tracks';
import { Genres } from './pages/genres/genres';
import { Artists } from './pages/artists/artists';
import { RecentlyPlayed } from './pages/recently-played/recently-played';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { 
    path: 'dashboard', 
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
      { path: 'profile', component: Profile },
      { path: 'genres', component: Genres }, 
      { path: 'recently-played', component: RecentlyPlayed }, 
      { path: 'tracks', component: Tracks },
      { path: 'artists', component: Artists },
    ]
  },
];