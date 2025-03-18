import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionsService } from '../../services/connections.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-mynetwork',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mynetwork.component.html',
  styleUrl: './mynetwork.component.css'
})
export class MynetworkComponent implements OnInit {
  notifications: any[] = []; // List of pending connection requests with sender details
  isLoading: boolean = true; // Loading state
  currentUserId: string = ''; // Current user's ID

  // Message object
  message = {
    text: '',
    type: '' // 'success' or 'error'
  };

  constructor(private connectionService: ConnectionsService) { }

  ngOnInit(): void {
    this.getCurrentUserId();
    if (this.currentUserId) {
      this.fetchPendingRequests();
    } else {
      this.showMessage('User ID not found. Please log in again.', 'error');
    }
  }

  // Retrieve and decode token to get user ID
  getCurrentUserId(): void {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Decoded Token:', decodedToken); // Log the decoded token
        this.currentUserId = decodedToken.userId || decodedToken.sub || decodedToken.id;
        console.log('Current User ID:', this.currentUserId); // Log the current user ID

        if (!this.currentUserId) {
          console.error('User ID not found in token.');
          this.showMessage('User ID not found in token. Please log in again.', 'error');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.showMessage('Invalid token. Please log in again.', 'error');
      }
    } else {
      console.warn('No token found in local storage.');
      this.showMessage('No token found. Please log in again.', 'error');
    }
  }

  fetchPendingRequests(): void {
    this.connectionService.getPendingRequests(this.currentUserId).subscribe({
      next: (data) => {
        console.log('Pending Requests:', data); // Log the pending requests
  
        // Fetch sender details for each connection request
        data.forEach((request: any) => {
          this.connectionService.getUserById(request.senderId).subscribe({
            next: (response) => {
              console.log('Sender Details Response:', response); // Log the full response
  
              // Access the nested `user` object
              const senderDetails = response.user;
              console.log('Sender Details:', senderDetails); // Log the sender details
  
              // Combine sender details with the connection request
              const notification = {
                ...request,
                sender: senderDetails // Use the nested `user` object
              };
              this.notifications.push(notification);
            },
            error: (error) => {
              console.error('Error fetching sender details:', error);
            }
          });
        });
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching pending requests:', error);
        this.isLoading = false;
        this.showMessage('Failed to fetch pending requests. Please try again later.', 'error');
      }
    });
  }

  // Accept a connection request
  acceptConnection(connectionId: string): void {
    this.connectionService.acceptConnection(connectionId).subscribe({
      next: () => {
        this.showMessage('Connection request accepted!', 'success');
        // Remove the accepted request from the list
        this.notifications = this.notifications.filter(n => n.id !== connectionId);
      },
      error: (error) => {
        console.error('Error accepting connection:', error);
        this.showMessage('Failed to accept connection. Please try again later.', 'error');
      }
    });
  }

  // Reject a connection request
  rejectConnection(connectionId: string): void {
    this.connectionService.rejectConnection(connectionId).subscribe({
      next: () => {
        this.showMessage('Connection request rejected.', 'success');
        // Remove the rejected request from the list
        this.notifications = this.notifications.filter(n => n.id !== connectionId);
      },
      error: (error) => {
        console.error('Error rejecting connection:', error);
        this.showMessage('Failed to reject connection. Please try again later.', 'error');
      }
    });
  }

  // Show a message
  showMessage(text: string, type: 'success' | 'error'): void {
    this.message.text = text;
    this.message.type = type;

    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  // Clear the message
  clearMessage(): void {
    this.message.text = '';
    this.message.type = '';
  }
}