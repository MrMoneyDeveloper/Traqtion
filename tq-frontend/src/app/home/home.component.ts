import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(50px)', opacity: 0 }),
        animate('1000ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section" [@fadeIn]>
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title">Welcome to Traq!</h1>
          <p class="hero-subtitle">Your seamless solution to manage people, accounts, and transactions</p>
          <hr class="divider">
          <p class="hero-description">
            Discover innovative, robust, and user-friendly solutions built to drive your success.
          </p>
          <a class="btn btn-primary btn-lg" routerLink="/about" role="button">Learn More</a>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section" [@slideUp]>
        <div class="container">
          <h2>Why Choose Traq?</h2>
          <p class="lead">Experience efficiency, real-time insights, and exceptional support that elevates your business.</p>
          <div class="row text-center">
            <div class="col-md-4 feature feature-gradient-1">
              <div class="icon-box">
                <i class="fa fa-users fa-3x"></i>
              </div>
              <h3>User Management</h3>
              <p>Effortlessly manage people and accounts with our intuitive interface.</p>
            </div>
            <div class="col-md-4 feature feature-gradient-2">
              <div class="icon-box">
                <i class="fa fa-exchange-alt fa-3x"></i>
              </div>
              <h3>Transaction Control</h3>
              <p>Keep track of all financial activities with precision and ease.</p>
            </div>
            <div class="col-md-4 feature feature-gradient-3">
              <div class="icon-box">
                <i class="fa fa-cogs fa-3x"></i>
              </div>
              <h3>Customizable Workflow</h3>
              <p>Tailor the system to fit your unique business processes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [/* keep your current styles, unchanged */]
})
export class HomeComponent { }
