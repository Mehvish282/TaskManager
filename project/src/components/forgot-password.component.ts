import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card" style="max-width: 400px; margin: 4rem auto;">
        <h2 style="text-align: center; margin-bottom: 2rem; color: #17a2b8;">Forgot Password</h2>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" formControlName="email" placeholder="Enter your email">
            <div *ngIf="form.get('email')?.invalid && form.get('email')?.touched" style="color: red;">
              Please enter a valid email
            </div>
          </div>

          <button type="submit" class="btn btn-info" style="width: 100%;" [disabled]="form.invalid || isLoading">
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <div *ngIf="successMessage" style="color: green; margin-top: 1rem;">
            {{ successMessage }}
          </div>
          <div *ngIf="errorMessage" style="color: red; margin-top: 1rem;">
            {{ errorMessage }}
          </div>
        </form>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.auth.forgotPassword(this.form.value.email).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Reset link sent (check email).';
          this.form.reset();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Something went wrong.';

        }
      });
    }
  }
}
