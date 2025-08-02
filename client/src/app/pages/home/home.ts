import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  loginUrl: string = `${environment.apiUrl}/auth/spotify/login`;

  constructor() { }
}
