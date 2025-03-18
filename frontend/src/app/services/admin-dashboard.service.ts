import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/all-users`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Fetch all resources (books)
  getAllResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/all`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Fetch all borrowed books
  getBorrowedBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/borrowed-books`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Fetch overdue books
  getOverdueBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/overdue-books`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Fetch all attachments
  getAllAttachments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attachments/all`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Fetch users who haven't returned books
  getUsersWithOverdueBooks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/overdue-by-user`, {
      headers: { Authorization: `Bearer ${this.getToken()}` },
    });
  }

  // Helper method to get the token from local storage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}