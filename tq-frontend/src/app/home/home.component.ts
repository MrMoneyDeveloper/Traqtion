import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
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
  styles: [`
    .home-container {
      font-family: 'Roboto', sans-serif;
      overflow: hidden;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      background: url('/assets/home-bg') no-repeat center center;
      background-size: cover;
      padding: 150px 20px;
      text-align: center;
      color: #fff;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .hero-content {
      position: relative;
      z-index: 2;
    }
    .hero-title {
      font-size: 4rem;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .hero-subtitle {
      font-size: 1.5rem;
      margin-bottom: 20px;
    }
    .divider {
      width: 50%;
      margin: 20px auto;
      border-top: 2px solid rgba(255, 255, 255, 0.3);
    }
    .hero-description {
      font-size: 1.25rem;
      margin-bottom: 30px;
    }

    /* Features Section */
    .features-section {
      padding: 80px 20px;
      background: linear-gradient(to right, #f8f9fa, #e9ecef);
      color: #343a40;
    }
    .features-section h2 {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .features-section .lead {
      font-size: 1.2rem;
      margin-bottom: 40px;
    }

    .feature {
      padding: 30px 20px;
      border-radius: 10px;
      color: #fff;
      margin-bottom: 30px;
    }

    .icon-box {
      margin-bottom: 20px;
    }

    /* Gradient styles for color separation */
    .feature-gradient-1 {
      background: linear-gradient(135deg, #007bff, #00c6ff);
    }
    .feature-gradient-2 {
      background: linear-gradient(135deg, #28a745, #7ed56f);
    }
    .feature-gradient-3 {
      background: linear-gradient(135deg, #6f42c1, #b983ff);
    }

    .feature h3 {
      margin-top: 10px;
      font-weight: 600;
    }

    .feature p {
      font-size: 1rem;
      margin-top: 10px;
    }

    @media (max-width: 768px) {
      .hero-title { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.25rem; }
      .hero-description { font-size: 1rem; }
      .features-section h2 { font-size: 2rem; }
    }
  `],
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
  standalone: false
})
export class HomeComponent { }
