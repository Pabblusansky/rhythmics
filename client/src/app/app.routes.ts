import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { authGuard } from './guards/auth-guard'; 

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
];