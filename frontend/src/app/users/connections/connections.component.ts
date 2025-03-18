import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConnectionsService } from '../../services/connections.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.css'
})
export class ConnectionsComponent implements OnInit {
  searchQuery: string = '';
  users: any[] = []; // List of all users
  filteredUsers: any[] = []; // Filtered users for display
  isLoading: boolean = true;
  currentUserId: string = ''; // Dynamically assigned after decoding token

  // Message object
  message = {
    text: '',
    type: '', // 'success' or 'error'
  };

  constructor(private connectionsService: ConnectionsService) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    if (this.currentUserId) {
      this.fetchAllUsers();
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
        console.log('Decoded Token:', decodedToken); // Log the decoded token for debugging

        // Ensure the correct field is used (e.g., userId, sub, id, etc.)
        this.currentUserId = decodedToken.userId || decodedToken.sub || decodedToken.id;

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

  // Fetch all users and filter based on connection status
  fetchAllUsers(): void {
    this.connectionsService.getAllUsers().subscribe({
      next: (data) => {
        console.log('All Users:', data); // Log all users fetched from the API

        // Fetch all connections for the current user
        this.connectionsService.getUserConnections(this.currentUserId).subscribe({
          next: (connections) => {
            console.log('User Connections:', connections); // Log the current user's connections

            // Extract the IDs of users who have a connection status
            const connectedUserIds = connections.map(connection =>
              connection.senderId === this.currentUserId ? connection.receiverId : connection.senderId
            );

            console.log('Connected User IDs:', connectedUserIds); // Log connected user IDs

            // Filter out users who have a connection status or are the current user
            this.users = data.filter(user =>
              !connectedUserIds.includes(user.id) && user.id !== this.currentUserId
            );

            console.log('Filtered Users:', this.users); // Log filtered users

            this.filteredUsers = [...this.users]; // Initialize filtered users
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching connections:', error);
            this.isLoading = false;
            this.showMessage('Failed to fetch connections. Please try again later.', 'error');
          }
        });
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
        this.showMessage('Failed to fetch users. Please try again later.', 'error');
      },
    });
  }

  // Send a connection request
  sendConnectionRequest(receiverId: string): void {
    if (!this.currentUserId) {
      this.showMessage('User ID not found. Please log in again.', 'error');
      return;
    }

    this.connectionsService.sendConnectionRequest(this.currentUserId, receiverId).subscribe({
      next: () => {
        this.showMessage('Connection request sent successfully!', 'success');
        // Update the button status to "Pending"
        this.users = this.users.map(user =>
          user.id === receiverId ? { ...user, connectionStatus: 'pending' } : user
        );
        this.filteredUsers = this.users.filter(user => user.connectionStatus !== 'pending');
      },
      error: (error) => {
        console.error('Error sending connection request:', error);
        this.showMessage('Failed to send connection request. Please try again later.', 'error');
      },
    });
  }

  // Search functionality
  searchUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
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