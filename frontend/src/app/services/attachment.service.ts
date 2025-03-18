import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private baseUrl = 'http://localhost:9000/attachments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createAttachment(attachment: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, attachment, { headers: this.getHeaders() });
  }

  getAllAttachments(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`, { headers: this.getHeaders() });
  }

  getAttachmentById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateAttachment(id: string, attachment: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/update/${id}`, attachment, { headers: this.getHeaders() });
  }

  applyForAttachment(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/apply/${id}`, {}, { headers: this.getHeaders() });
  }

  // Add this method for soft delete
  softDeleteAttachment(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/soft-delete/${id}`, {}, { headers: this.getHeaders() });
  }
}