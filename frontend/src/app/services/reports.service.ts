import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:9000';

  constructor(private http: HttpClient) {}

  // User Management
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/all-users`);
  }

  getSingleUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}`);
  }

  getDeletedUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/deleted-users`); // Assuming an endpoint for deleted users
  }

  // Resource Management
  getAllResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/all`);
  }

  getBorrowedResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/borrowed-books`);
  }

  getOverdueResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/overdue-books`);
  }

  getResourcesBorrowedByUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/borrowed-by-user/${userId}`);
  }

  getOverdueResourcesForUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources/overdue-by-user/${userId}`);
  }

  // Connection Management
  getAllConnections(): Observable<any> {
    return this.http.get(`${this.apiUrl}/connections`);
  }

  getPendingConnectionRequests(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/connections/pending-requests/${userId}`);
  }

  // Message Management
  getMessageHistory(senderId: string, receiverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${senderId}/${receiverId}`);
  }

  // Attachment Management
  getAllAttachments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attachments/all`);
  }

  getSoftDeletedAttachments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attachments/soft-deleted`); // Assuming an endpoint for soft-deleted attachments
  }

  getRestoredAttachments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/attachments/restored`); // Assuming an endpoint for restored attachments
  }
}