import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AttachmentService } from '../../services/attachment.service';

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attachments.component.html',
  styleUrl: './attachments.component.css'
})
export class AttachmentsComponent implements OnInit {
  attachments: any[] = []; // Ensure attachments is always an array

  constructor(private attachmentService: AttachmentService) {}

  ngOnInit() {
    this.fetchAttachments();
  }

  fetchAttachments() {
    this.attachmentService.getAllAttachments().subscribe({
      next: (data) => {
        console.log('Fetched attachments:', data); // Debugging statement
        if (Array.isArray(data)) {
          this.attachments = data; // Ensure it's an array
        } else if (data && typeof data === 'object' && Array.isArray(data.attachments)) {
          this.attachments = data.attachments; // Handle wrapped response object
        } else {
          this.attachments = []; // Fallback to empty array if response is invalid
          console.error('Unexpected response format:', data);
        }
      },
      error: (err) => {
        console.error('Error fetching attachments:', err);
        this.attachments = []; // Ensure UI does not break
      }
    });
  }

  applyNow(attachmentId: string) {
    this.attachmentService.applyForAttachment(attachmentId).subscribe({
      next: () => alert('Application successful!'),
      error: (err) => alert('Error applying: ' + err.message)
    });
  }
}
