// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = 'http://localhost:9000/resources';

  constructor(private http: HttpClient) {}

  // Helper method to get the token from localStorage
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Helper method to decode the token and get the user ID
  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the token
      console.log('Decoded Token:', decodedToken); // Log the decoded token for debugging
      return decodedToken.id; // Extract the user ID from the token payload
    }
    return null;
  }

  // Helper method to create headers with the token
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Get all resources
  getAllResources(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`);
  }

  // Borrow a book
  borrowBook(payload: { resource_id: string; return_date: string }): Observable<any> {
    const userId = this.getUserId(); // Get the user ID from the token
    if (!userId) {
      throw new Error('User ID not found in token.');
    }

    const fullPayload = {
      ...payload,
      user_id: userId, // Include the user ID in the payload
    };

    console.log('Borrow Payload:', fullPayload); // Log the payload for debugging
    return this.http.post(`${this.baseUrl}/borrow`, fullPayload, { headers: this.getHeaders() });
  }

  // Get all borrowed books for the logged-in user
  getBorrowedBooks(): Observable<any> {
    const userId = this.getUserId(); // Get the user ID from the token
    if (!userId) {
      throw new Error('User ID not found in token.');
    }

    return this.http.get(`${this.baseUrl}/borrowed-by-user/${userId}`, { headers: this.getHeaders() });
  }

  // Get all overdue books for the logged-in user
  getOverdueBooks(): Observable<any> {
    const userId = this.getUserId(); // Get the user ID from the token
    if (!userId) {
      throw new Error('User ID not found in token.');
    }

    return this.http.get(`${this.baseUrl}/overdue-by-user/${userId}`, { headers: this.getHeaders() });
  }

  // View a single resource by ID
  viewResource(resourceId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/view/${resourceId}`, { headers: this.getHeaders() });
  }

  // Return a book
  returnBook(resourceId: string): Observable<any> {
    const userId = this.getUserId(); // Get the user ID from the token
    if (!userId) {
      throw new Error('User ID not found in token.');
    }

    const payload = {
      resource_id: resourceId,
      user_id: userId, // Include the user ID in the payload
    };

    return this.http.post(`${this.baseUrl}/return`, payload, { headers: this.getHeaders() });
  }

  // Add a resource
  addResource(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, formData);
  }

  // Edit a resource
  editResource(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit/${id}`, formData, { headers: this.getHeaders() });
  }

  // Delete a resource
  deleteResource(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}