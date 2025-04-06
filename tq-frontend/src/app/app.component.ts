import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
  // Make sure there is no "standalone: true" here
})
export class AppComponent {
  title = 'Tq Frontend';
}
