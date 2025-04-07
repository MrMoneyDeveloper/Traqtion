import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../app/services/auth.service'; // adjust the path if necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
  // Make sure there is no "standalone: true" here
})
export class AppComponent {
  title = 'Tq Frontend';

  constructor(public authService: AuthService, private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
