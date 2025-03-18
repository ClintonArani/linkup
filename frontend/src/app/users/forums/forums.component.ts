import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumComponent {
  forums = [
    {
      title: 'Web Development Enthusiasts',
      description: 'A place for web developers to discuss new trends, frameworks, and best practices.',
      groupIcon: 'assets/team-1.jpg',
      members: [
        { name: 'John', profilePictureUrl: 'assets/image1.png' },
        { name: 'Alice', profilePictureUrl: 'assets/image2.png' },
        { name: 'Bob', profilePictureUrl: 'assets/image3.png' }
      ]
    },
    {
      title: 'Machine Learning & AI',
      description: 'A community for AI and ML enthusiasts to share ideas and projects.',
      groupIcon: 'assets/team-2.jpg',
      members: [
        { name: 'Bob', profilePictureUrl: 'assets/image4.png' },
        { name: 'Eve', profilePictureUrl: 'assets/image5.png' }
      ]
    }
  ];

  newForum = { title: '', description: '', iconFile: null };
  isCreateForumModalVisible = false;

  // Chat Modal Properties
  isChatModalVisible = false;
  selectedForum: any = null;
  chatMessages: any[] = [];
  newMessage: string = '';
  selectedFile: File | null = null;

  constructor() {}

  openCreateForumModal() {
    this.isCreateForumModalVisible = true;
  }

  closeCreateForumModal() {
    this.isCreateForumModalVisible = false;
    this.newForum = { title: '', description: '', iconFile: null };
  }

  createForum() {
    if (this.newForum.title && this.newForum.description) {
      this.forums.push({
        title: this.newForum.title,
        description: this.newForum.description,
        groupIcon: this.newForum.iconFile || 'assets/default-icon.png',
        members: []
      });
      this.closeCreateForumModal();
    }
  }

  joinForum(forumTitle: string) {
    const forum = this.forums.find(f => f.title === forumTitle);
    if (forum) {
      const user = "User";
      const userProfilePicture = 'assets/person2.png';
      if (!forum.members.find(member => member.name === user)) {
        forum.members.push({ name: user, profilePictureUrl: userProfilePicture });
      }
    }
  }

  onIconFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newForum.iconFile = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Chat Modal Methods
  openChatModal(forum: any) {
    this.selectedForum = forum;
    this.isChatModalVisible = true;
    // Load chat messages (you can fetch from a service)
    this.chatMessages = [
      { sender: { name: 'John', profilePictureUrl: 'assets/image1.png' }, content: 'Hello everyone!', fileUrl: null, fileName: null },
      { sender: { name: 'Alice', profilePictureUrl: 'assets/image2.png' }, content: 'Hi John!', fileUrl: null, fileName: null }
    ];
  }

  closeChatModal() {
    this.isChatModalVisible = false;
    this.selectedForum = null;
    this.chatMessages = [];
    this.newMessage = '';
    this.selectedFile = null;
  }

  sendMessage() {
    if (this.newMessage || this.selectedFile) {
      const user = "User";
      const userProfilePicture = 'assets/person2.png';
      const message = {
        sender: { name: user, profilePictureUrl: userProfilePicture },
        content: this.newMessage,
        fileUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : null,
        fileName: this.selectedFile ? this.selectedFile.name : null
      };
      this.chatMessages.push(message);
      this.newMessage = '';
      this.selectedFile = null;
    }
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Helper method to check if a file is an image
  isImage(fileUrl: string): boolean {
    return fileUrl?.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  // Helper method to check if a file is a document
  isDocument(fileUrl: string): boolean {
    return fileUrl?.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/) != null;
  }
}