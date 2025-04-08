import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false  // explicitly mark as non-standalone
})
export class AppComponent {
  title = 'Tq Frontend';

  constructor(private router: Router) { }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
