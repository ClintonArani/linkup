import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  userMessage: string = '';
  chatMessages = [{ sender: 'Bot', text: 'Hello! How can I assist you today?' }];

  sendMessage() {
    if (this.userMessage.trim()) {
      this.chatMessages.push({ sender: 'User', text: this.userMessage });

      // Simulate Bot Response
      setTimeout(() => {
        this.chatMessages.push({ sender: 'Bot', text: this.getBotResponse(this.userMessage) });
      }, 1000);

      this.userMessage = '';
    }
  }

  getBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('internship')) {
      return 'You can check the Attachments & Internships section for available opportunities!';
    } else if (lowerMessage.includes('resources')) {
      return 'Visit the Academic Resources section for e-books and journals.';
    } else if (lowerMessage.includes('help')) {
      return 'I am here to help! Ask me about resources, internships, or navigation.';
    }
    return 'I am not sure about that. Try asking about academic resources, internships, or site navigation.';
  }
}

