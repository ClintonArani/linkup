import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AttachmentService } from '../../services/attachment.service';

@Component({
  selector: 'app-internships',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css']
})
export class AttachmentComponent implements OnInit {
  attachments: any[] = [];
  paginatedAttachments: any[] = [];
  showForm = false;
  isEditMode = false;
  currentAttachment: any = {
    id: null,
    title: '',
    description: '',
    companyName: '',
    applicationLink: ''
  };

  faTrash = faTrashAlt;
  faEdit = faEdit;

  currentPage = 1;
  itemsPerPage = 10;

  attachmentForm: FormGroup;

  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  showConfirmationDialog = false;
  attachmentIdToDelete: number | null = null;

  constructor(private attachmentService: AttachmentService, private fb: FormBuilder) {
    this.attachmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      companyName: ['', Validators.required],
      applicationLink: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  ngOnInit(): void {
    this.fetchAttachments();
  }

  fetchAttachments(): void {
    this.attachmentService.getAllAttachments().subscribe(
      (data: any) => {
        this.attachments = data.attachments || [];
        this.updatePaginatedAttachments();
      },
      (error) => {
        this.showMessage('Error fetching attachments', 'error');
      }
    );
  }

  updatePaginatedAttachments(): void {
    if (!Array.isArray(this.attachments)) {
      this.paginatedAttachments = [];
      return;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAttachments = this.attachments.slice(startIndex, endIndex);
  }

  openForm(): void {
    this.showForm = true;
    this.isEditMode = false;
    this.attachmentForm.reset();
  }

  closeForm(): void {
    this.showForm = false;
  }

  editAttachment(attachment: any): void {
    this.showForm = true;
    this.isEditMode = true;
    this.currentAttachment = { ...attachment };
    this.attachmentForm.patchValue({
      title: attachment.title,
      description: attachment.description,
      companyName: attachment.company_name,
      applicationLink: attachment.application_link
    });
  }

  confirmDelete(id: number): void {
    this.showConfirmationDialog = true;
    this.attachmentIdToDelete = id;
  }

  cancelDelete(): void {
    this.showConfirmationDialog = false;
    this.attachmentIdToDelete = null;
  }

  deleteAttachment(): void {
    if (this.attachmentIdToDelete !== null) {
      // Convert the number to a string
      const idAsString = this.attachmentIdToDelete.toString();
      this.attachmentService.softDeleteAttachment(idAsString).subscribe(
        () => {
          // Remove the deleted attachment from the list
          this.attachments = this.attachments.filter(attachment => attachment.id !== this.attachmentIdToDelete);
          this.updatePaginatedAttachments();
          this.showConfirmationDialog = false;
          this.showMessage('Attachment deleted successfully', 'success');
        },
        (error) => {
          this.showMessage('Error deleting attachment', 'error');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.attachmentForm.invalid) {
      return;
    }
  
    const attachmentData = {
      title: this.attachmentForm.value.title,
      description: this.attachmentForm.value.description,
      company_name: this.attachmentForm.value.companyName,
      application_link: this.attachmentForm.value.applicationLink
    };
  
    if (this.isEditMode) {
      this.attachmentService.updateAttachment(this.currentAttachment.id, attachmentData).subscribe(
        (response) => {
          const index = this.attachments.findIndex(attachment => attachment.id === this.currentAttachment.id);
          if (index !== -1) {
            this.attachments[index] = { ...this.currentAttachment, ...attachmentData };
          }
          this.updatePaginatedAttachments();
          this.closeForm();
          this.showMessage('Attachment updated successfully', 'success');
        },
        (error) => {
          this.showMessage('Error updating attachment', 'error');
        }
      );
    } else {
      this.attachmentService.createAttachment(attachmentData).subscribe(
        (response) => {
          // Refresh the attachments list after adding a new attachment
          this.fetchAttachments();
          this.closeForm();
          this.showMessage('Attachment added successfully', 'success');
        },
        (error) => {
          this.showMessage('Error creating attachment', 'error');
        }
      );
    }
  }

  showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedAttachments();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedAttachments();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.attachments.length / this.itemsPerPage);
  }
}