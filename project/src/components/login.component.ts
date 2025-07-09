import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 500px; margin: 1rem auto; top: 50px">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #667eea;">Task Manager Login</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input 
              type="email" 
              class="form-control" 
              formControlName="email"
              placeholder="Enter your email"
            >
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                 style="color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem;">
              Email is required
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              formControlName="password"
              placeholder="Enter your password"
            >
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                 style="color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem;">
              Password is required
            </div>
          </div>

          <div *ngIf="errorMessage" style="color: #dc3545; margin-bottom: 1rem; text-align: center;">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn" 
            [disabled]="loginForm.invalid || isLoading"
            style="width: 100%;"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        
        <div style="margin-top: 1.5rem; text-align: center;">
  <button 
    type="button" 
    class="btn btn-link" 
    style="margin-right: 1rem; color:rgb(255, 255, 255); text-decoration: underline;"
    (click)="goToSignup()"
  >
    Create Account
  </button>

  <button 
    type="button" 
    class="btn btn-link" 
    style="color:rgb(255, 255, 255); text-decoration: underline;"
    (click)="goToForgotPassword()"
  >
    Forgot Password?
  </button>
</div>


      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }

  }
  goToSignup() {
    this.router.navigate(['/signup']);
  }
  goToForgotPassword() {  
    this.router.navigate(['/forgot-password']);
}
}
