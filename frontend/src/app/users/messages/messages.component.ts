import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  senderId: string | null = null; // Logged-in user ID
  receiverId: string | null = null; // Selected user ID
  selectedUserName: string | null = null; // Name of the selected user
  message = ''; // Current message input
  messages: any[] = []; // List of messages
  users: any[] = []; // List of all users in the system

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService // Service to fetch all users
  ) {}

  ngOnInit(): void {
    // Get the logged-in user's ID from the token
    this.senderId = this.authService.getUserIdFromToken();

    // Ensure senderId is not null before proceeding
    if (this.senderId) {
      // Fetch the list of all users (excluding the logged-in user)
      this.fetchUsers();

      // Join the chat room for the logged-in user
      this.messageService.joinRoom(this.senderId);

      // Listen for new messages in real-time
      this.messageService.onReceiveMessage().subscribe({
        next: (data: any) => {
          // Check if the message is for the current chat
          if (
            (data.sender_id === this.senderId && data.receiver_id === this.receiverId) ||
            (data.sender_id === this.receiverId && data.receiver_id === this.senderId)
          ) {
            // Add the new message to the messages array
            this.messages.push(data);
          }
        },
        error: (err: any) => console.error('Error receiving message:', err),
      });
    } else {
      console.error('Sender ID is null. User is not authenticated.');
    }
  }

  // Fetch the list of all users (replace with your API call)
  fetchUsers() {
    this.userService.fetchAllUsers().subscribe({
      next: (data: { users: any[] }) => {
        // Filter out the logged-in user from the list
        this.users = data.users.filter((user: any) => user.id !== this.senderId);
      },
      error: (err: any) => console.error('Failed to fetch users:', err),
    });
  }

  // Select a user to chat with
  selectUser(userId: string) {
    this.receiverId = userId;
    this.selectedUserName = this.users.find((u) => u.id === userId)?.firstName || null;
    this.loadMessages();
  }

  // Load message history between the logged-in user and the selected user
  loadMessages() {
    if (this.senderId && this.receiverId) {
      this.messageService.getMessages(this.senderId, this.receiverId).subscribe({
        next: (data: any[]) => (this.messages = data),
        error: (err: any) => console.error('Failed to load messages:', err),
      });
    }
  }

  // Send a message
  sendMessage() {
    if (this.message.trim() && this.senderId && this.receiverId) {
      this.messageService
        .sendMessage(this.senderId, this.receiverId, this.message)
        .subscribe({
          next: () => {
            this.message = ''; // Clear input after sending
            // No need to call loadMessages() here because Socket.IO will handle real-time updates
          },
          error: (err: any) => console.error('Failed to send message:', err),
        });
    }
  }
}