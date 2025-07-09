import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User, UserRole, LoginRequest, AuthResponse } from '../models/user.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.getCurrentUserFromApi().subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout()
      });
    }
  }

  // ✅ LOGIN
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        localStorage.setItem('authToken', response.token);
        this.currentUserSubject.next(response.user);
        return response;
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  // ✅ REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => new Error(error.error?.message || 'Signup failed'));
      })
    );
  }

  // ✅ FORGOT PASSWORD
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(error => {
        console.error('Forgot password error:', error);
        return throwError(() => new Error(error.error?.message || 'Forgot password failed'));
      })
    );
  }

  // ✅ LOGOUT
  logout(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        complete: () => {
          localStorage.removeItem('authToken');
          this.currentUserSubject.next(null);
        },
        error: () => {
          localStorage.removeItem('authToken');
          this.currentUserSubject.next(null);
        }
      });
    } else {
      localStorage.removeItem('authToken');
      this.currentUserSubject.next(null);
    }
  }

  // ✅ CHECK AUTHENTICATION
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && !!localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private getCurrentUserFromApi(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }
}
