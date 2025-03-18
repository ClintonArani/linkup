import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService {
  private apiUrl = 'http://localhost:9000'; 
  private usersUrl = 'http://localhost:9000/users';

  constructor(private http: HttpClient) {}

  // Fetch all users
  getAllUsers(): Observable<any[]> {
    return this.http.get<{ users: any[] }>(`${this.apiUrl}/users/all-users`).pipe(
      map((response) => response.users) // Extract the users array from the response
    );
  }

  // Fetch all connections for a specific user
  getUserConnections(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/connections/user-connections/${userId}`);
  }

  // Send a connection request
  sendConnectionRequest(senderId: string, receiverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/connections/send-request`, { senderId, receiverId });
  }

    // Fetch pending connection requests for the current user
    getPendingRequests(userId: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/connections/pending-requests/${userId}`);
    }
  
    // Fetch user details by ID
    getUserById(userId: string): Observable<any> {
      return this.http.get(`${this.usersUrl}/${userId}`);
    }
  
    // Accept a connection request
    acceptConnection(connectionId: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/connections/update-status/${connectionId}`, { status: 'accepted' });
    }
  
    // Reject a connection request
    rejectConnection(connectionId: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/connections/update-status/${connectionId}`, { status: 'rejected' });
    }
}