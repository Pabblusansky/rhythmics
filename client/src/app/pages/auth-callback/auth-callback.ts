import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({ template: '<p>Logging in...</p>' })
export class AuthCallbackComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const refreshToken = params['refresh_token'];
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        this.router.navigate(['/dashboard']); 
      } else {
        this.router.navigate(['/home']); 
      }
    });
  }
}