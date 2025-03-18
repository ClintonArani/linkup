import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private socket: Socket;
  private apiUrl = 'http://localhost:9000'; // Your backend API URL

  constructor(private http: HttpClient) {
    // Connect to the Socket.IO server
    this.socket = io(this.apiUrl);
  }

  // Send a message
  sendMessage(senderId: string, receiverId: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/messages/send`, {
      sender_id: senderId,
      receiver_id: receiverId,
      message: message,
    });
  }

  // Get message history
  getMessages(senderId: string, receiverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/${senderId}/${receiverId}`);
  }

  // Listen for new messages
  onReceiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data) => {
        observer.next(data);
      });
    });
  }

  // Join a chat room
  joinRoom(userId: string) {
    this.socket.emit('joinRoom', userId);
  }
}