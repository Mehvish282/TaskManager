import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 500px; margin: 4rem auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #28a745;">Create Account</h2>

        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" class="form-control" formControlName="firstName" placeholder="First Name">
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" class="form-control" formControlName="lastName" placeholder="Last Name">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" formControlName="email" placeholder="Email">
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Password">
          </div>

          <div *ngIf="errorMessage" style="color: #dc3545; margin: 1rem 0; text-align: center;">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn btn-success" [disabled]="signupForm.invalid || isLoading" style="width: 100%;">
            {{ isLoading ? 'Signing up...' : 'Sign Up' }}
          </button>
        </form>

        <div style="margin-top: 1rem; text-align: center;">
  <button type="button" class="btn btn-link" (click)="goToLogin()" style="color:rgb(255, 255, 255); text-decoration: underline;">
    Already have an account? Login
  </button>
</div>

      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.signupForm.value).subscribe({
  next: () => {
    this.router.navigate(['/login']); // ✅ navigate to login after successful signup
  },
  error: (err) => {
    this.errorMessage = err.error?.message || 'Something went wrong during signup.';
  }
});

    }
  }
  goToLogin() {
  this.router.navigate(['/login']);
}

}
