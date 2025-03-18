import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  resourceForm: FormGroup;
  resources: any[] = [];
  isEditMode = false;
  selectedResourceId: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isFormVisible = false; // Controls form visibility
  isConfirmationVisible = false; // Controls confirmation message visibility
  resourceToDeleteId: string | null = null; // Stores the ID of the resource to delete

  constructor(private fb: FormBuilder, private bookService: BookService) {
    this.resourceForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      file: [null],
      image: [null],
    });
  }
  
  // Method to clear messages after 3 seconds
  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000); // 3000 milliseconds = 3 seconds
  }

  ngOnInit(): void {
    this.loadResources();
  }

  // Show the form
  showForm(): void {
    this.isFormVisible = true;
  }

  // Hide the form
  hideForm(): void {
    this.isFormVisible = false;
    this.resetForm();
  }

  // Load all resources
  loadResources(): void {
    this.bookService.getAllResources().subscribe(
      (data) => {
        this.resources = data;
      },
      (error) => {
        this.errorMessage = 'Failed to load resources.';
        this.clearMessages();
      }
    );
  }

  // Handle file input change
  onFileChange(event: any, field: string): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.resourceForm.get(field)?.setValue(file);
    }
  }

  // Submit the form
  onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.resourceForm.get('title')?.value);
    formData.append('description', this.resourceForm.get('description')?.value);
    formData.append('quantity', this.resourceForm.get('quantity')?.value);
    formData.append('file', this.resourceForm.get('file')?.value);
    formData.append('image', this.resourceForm.get('image')?.value);

    if (this.isEditMode && this.selectedResourceId) {
      this.bookService.editResource(this.selectedResourceId, formData).subscribe(
        () => {
          this.successMessage = 'Resource updated successfully!';
          this.clearMessages();
          this.hideForm();
          this.loadResources();
        },
        () => {
          this.errorMessage = 'Failed to update resource.';
          this.clearMessages();
        }
      );
    } else {
      this.bookService.addResource(formData).subscribe(
        () => {
          this.successMessage = 'Resource added successfully!';
          this.clearMessages();
          this.hideForm();
          this.loadResources();
        },
        () => {
          this.errorMessage = 'Failed to add resource.';
          this.clearMessages();
        }
      );
    }
  }

  // Edit a resource
  onEdit(resource: any): void {
    this.isEditMode = true;
    this.selectedResourceId = resource.id;
    this.resourceForm.patchValue({
      title: resource.title,
      description: resource.description,
      quantity: resource.quantity,
    });
    this.showForm();
  }

  // Delete a resource
  onDelete(id: string): void {
    this.resourceToDeleteId = id;
    this.isConfirmationVisible = true;
  }

  // Confirm deletion
  confirmDelete(): void {
    if (this.resourceToDeleteId) {
      this.bookService.deleteResource(this.resourceToDeleteId).subscribe(
        () => {
          this.successMessage = 'Resource deleted successfully!';
          this.clearMessages();
          this.isConfirmationVisible = false;
          this.loadResources();
        },
        () => {
          this.errorMessage = 'Failed to delete resource.';
          this.clearMessages()
        }
      );
    }
  }

  // Cancel deletion
  cancelDelete(): void {
    this.isConfirmationVisible = false;
    this.resourceToDeleteId = null;
  }

  // Reset the form
  resetForm(): void {
    this.resourceForm.reset();
    this.isEditMode = false;
    this.selectedResourceId = null;
  }
}