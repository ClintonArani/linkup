import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import Chart from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css'],
})
export class ResourcesComponent implements OnInit {
  resources: any[] = []; // List of all available resources (books)
  selectedResourceId: string = ''; // Selected book ID for borrowing
  returnDate: string = ''; // Return date for borrowing
  borrowedBooks: any[] = []; // List of books borrowed by the user
  overdueBooks: any[] = []; // List of overdue books borrowed by the user
  message: { text: string; type: 'success' | 'error' } | null = null; // Message object for success/error

  // Chart instances
  borrowedBooksChart: any;
  borrowedOverdueChart: any;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.fetchAllResources(); // Fetch all available books
    this.fetchBorrowedBooks(); // Fetch books borrowed by the user
    this.fetchOverdueBooks(); // Fetch overdue books borrowed by the user
  }

  // Fetch all available resources (books)
  fetchAllResources() {
    this.bookService.getAllResources().subscribe({
      next: (data: any) => {
        this.resources = data;
      },
      error: (error) => {
        console.error('Error fetching resources:', error);
        this.showMessage('Failed to fetch resources. Please try again.', 'error');
      },
    });
  }

  // Fetch books borrowed by the user
  fetchBorrowedBooks() {
    this.bookService.getBorrowedBooks().subscribe({
      next: (data: any) => {
        this.borrowedBooks = data;
        this.createBorrowedBooksChart(); // Create the "Borrowed Books" chart
        this.updateBorrowedOverdueChart(); // Update the "Borrowed vs Overdue" chart
      },
      error: (error) => {
        console.error('Error fetching borrowed books:', error);
        this.showMessage('Failed to fetch borrowed books. Please try again.', 'error');
      },
    });
  }

  // Fetch overdue books borrowed by the user
  fetchOverdueBooks() {
    this.bookService.getOverdueBooks().subscribe({
      next: (data: any) => {
        this.overdueBooks = data;
        this.updateBorrowedOverdueChart(); // Update the "Borrowed vs Overdue" chart
      },
      error: (error) => {
        console.error('Error fetching overdue books:', error);
        this.showMessage('Failed to fetch overdue books. Please try again.', 'error');
      },
    });
  }

  // Handle borrowing a book
  borrowBook() {
    if (this.selectedResourceId && this.returnDate) {
      const payload = {
        resource_id: this.selectedResourceId,
        return_date: this.returnDate,
      };
      this.bookService.borrowBook(payload).subscribe({
        next: () => {
          this.showMessage('Book borrowed successfully!', 'success');
          this.fetchBorrowedBooks(); // Refresh the borrowed books list
          this.selectedResourceId = ''; // Reset the selected book
          this.returnDate = ''; // Reset the return date
        },
        error: (error) => {
          console.error('Error borrowing book:', error);
          this.showMessage('Failed to borrow the book. Please try again.', 'error');
        },
      });
    } else {
      this.showMessage('Please select a book and provide a return date.', 'error');
    }
  }

  // Handle returning a book
  returnBook(resourceId: string) {
    if (!resourceId) {
      this.showMessage('Invalid book ID.', 'error');
      return;
    }

    this.bookService.returnBook(resourceId).subscribe({
      next: () => {
        this.showMessage('Book returned successfully!', 'success');
        setTimeout(() => {
          window.location.reload(); // Refresh the page after 2 seconds
        }, 2000);
      },
      error: (error) => {
        console.error('Error returning book:', error);
        this.showMessage('Failed to return the book. Please try again.', 'error');
      },
    });
  }

  // Helper function to show messages
  showMessage(text: string, type: 'success' | 'error') {
    this.message = { text, type };
    setTimeout(() => {
      this.message = null; // Clear the message after 2 seconds
    }, 2000);
  }

  // Create the "Borrowed Books" pie chart
  createBorrowedBooksChart() {
    const borrowedBookCounts = this.borrowedBooks.reduce((acc, book) => {
      acc[book.title] = (acc[book.title] || 0) + 1;
      return acc;
    }, {});

    const ctx = document.getElementById('borrowedBooksChart') as HTMLCanvasElement;
    this.borrowedBooksChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(borrowedBookCounts), // Book titles
        datasets: [
          {
            data: Object.values(borrowedBookCounts), // Number of times each book is borrowed
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#4D5360',
            ], // Different colors for each book
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Borrowed Books by Title',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value} time${value !== 1 ? 's' : ''}`; // Show how many times a book is borrowed
              },
            },
          },
        },
      },
    });
  }

  // Create or update the "Borrowed vs Overdue" bar chart
  updateBorrowedOverdueChart() {
    const ctx = document.getElementById('borrowedOverdueChart') as HTMLCanvasElement;

    if (this.borrowedOverdueChart) {
      this.borrowedOverdueChart.destroy(); // Destroy the existing chart
    }

    this.borrowedOverdueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Borrowed Books', 'Overdue Books'],
        datasets: [
          {
            label: 'Count',
            data: [this.borrowedBooks.length, this.overdueBooks.length],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Borrowed vs Overdue Books',
          },
        },
      },
    });
  }
}