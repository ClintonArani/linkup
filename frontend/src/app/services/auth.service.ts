import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Install jwt-decode: npm install jwt-decode

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:9000/auth/login'; // Login API
  private logoutUrl = 'http://localhost:9000/auth/logout'; // Logout API

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(credentials: { email: string; password: string }): Observable<{ token: string; role: string; message: string }> {
    return this.http.post<{ token: string; role: string; message: string }>(this.apiUrl, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token); // Store token
        localStorage.setItem('role', response.role); // Store user role
      })
    );
  }

  // Logout method
  logout(): Observable<{ message: string }> {
    const token = this.getToken();
    if (!token) {
      // If no token is found, navigate to login and clear local storage
      this.clearLocalStorageAndNavigate();
      throw new Error('No token found');
    }

    // Send a POST request to the logout endpoint with the token in the Authorization header
    return this.http
      .post<{ message: string }>(
        this.logoutUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .pipe(
        tap({
          next: () => {
            // Clear local storage and navigate to the login page on success
            this.clearLocalStorageAndNavigate();
          },
          error: (err) => {
            // If the logout request fails, still clear local storage and navigate to login
            this.clearLocalStorageAndNavigate();
            console.error('Logout failed:', err);
          },
        })
      );
  }

  // Helper method to clear local storage and navigate to login
  private clearLocalStorageAndNavigate(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  // Get the stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get the stored role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Decode the token to get user details
  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id; // Assuming the token contains the user ID
    }
    return null;
  }
}