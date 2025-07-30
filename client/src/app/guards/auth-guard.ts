import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const spotifyService = inject(SpotifyService);
  const router = inject(Router);

  return spotifyService.getUserProfile().pipe(
    map(user => {
      if (user) {
        return true; 
      }
      router.navigate(['/home']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/home']);
      return of(false);
    })
  );
};