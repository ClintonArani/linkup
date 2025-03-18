import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9000/users'; // Base API URL for better organization

  constructor(private http: HttpClient) {}


  registerUser(userData: any): Observable<any> {
    console.log('Sending user data:', userData); // Log the payload
    return this.http.post(`${this.apiUrl}/create`, userData).pipe(
      catchError(this.handleError)
    );
  }

  // Common error handler method
  private handleError(error: any) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
  // Get all users
  fetchAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-users`);
  }

  // Get a single user by ID
  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // Switch user role
  switchUserRole(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/switch-role`, { user_id: userId });
  }

  // Update a user
  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update/${userId}`, userData);
  }

  // Delete a user
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${userId}`);
  }
}
