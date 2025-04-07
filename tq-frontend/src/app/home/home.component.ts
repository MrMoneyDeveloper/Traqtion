import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <!-- Hero Section with Parallax Background and Fade-In Animation -->
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

      <!-- Features Section with Slide-Up Animation -->
      <section class="features-section" [@slideUp]>
        <div class="container">
          <h2>Why Choose Traq?</h2>
          <p class="lead">Experience efficiency, real-time insights, and exceptional support that elevates your business.</p>
          <div class="row text-center">
            <div class="col-md-4 feature">
              <i class="fa fa-users fa-3x"></i>
              <h3>User Management</h3>
              <p>Effortlessly manage people and accounts with our intuitive interface.</p>
            </div>
            <div class="col-md-4 feature">
              <i class="fa fa-exchange-alt fa-3x"></i>
              <h3>Transaction Control</h3>
              <p>Keep track of all financial activities with precision and ease.</p>
            </div>
            <div class="col-md-4 feature">
              <i class="fa fa-cogs fa-3x"></i>
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
    /* Hero Section Styles */
    .hero-section {
      position: relative;
      /* Use absolute path with a leading slash so that Angular resolves from the root */
      background: url('/assets/home-bg') no-repeat center center;
      background-size: cover;
      padding: 150px 20px;
      text-align: center;
      color: #fff;
    }
    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
    /* Features Section Styles */
    .features-section {
      background: #f8f9fa;
      color: #333;
      padding: 60px 20px;
    }
    .features-section h2 {
      color: #333;
      margin-bottom: 20px;
    }
    .feature {
      margin-bottom: 30px;
      padding: 20px;
    }
    .feature i {
      color: #007bff;
      margin-bottom: 15px;
    }
    @media (max-width: 767px) {
      .hero-title { font-size: 2.5rem; }
      .hero-subtitle { font-size: 1.25rem; }
      .hero-description { font-size: 1rem; }
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
