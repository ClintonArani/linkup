import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Data for cards
  totalUsers: number = 0;
  activeUsers: number = 0;
  inactiveUsers: number = 0;
  totalBooks: number = 0; // Total books by quantity
  totalBorrowedBooks: number = 0; // Total borrowed books
  totalOverdueBooks: number = 0; // Total overdue books
  totalAttachments: number = 0;

  // Data for tables
  borrowedBooks: any[] = [];
  overdueBooks: any[] = []; // General overdue books

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    // Fetch all users
    this.dashboardService.getAllUsers().subscribe(
      (response: any) => {
        console.log('Users API Response:', response); // Log the response
        if (response.users && Array.isArray(response.users)) {
          const users = response.users;
          this.totalUsers = users.length;
          this.activeUsers = users.filter((user: any) => user.isActive).length;
          this.inactiveUsers = this.totalUsers - this.activeUsers;
        } else {
          console.error('Expected an array but got:', response);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  
    // Fetch all resources (books)
    this.dashboardService.getAllResources().subscribe(
      (resources: any) => {
        console.log('Resources API Response:', resources); // Log the response
        if (Array.isArray(resources)) {
          this.totalBooks = resources.reduce((sum: number, book: any) => sum + book.quantity, 0);
        } else {
          console.error('Expected an array but got:', resources);
        }
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  
    // Fetch borrowed books
    this.dashboardService.getBorrowedBooks().subscribe(
      (books: any) => {
        console.log('Borrowed Books API Response:', books); // Log the response
        if (Array.isArray(books)) {
          this.totalBorrowedBooks = books.length;
          this.borrowedBooks = books.map((book: any) => ({
            user: `${book.firstName} ${book.lastName}`, // Combine first and last name
            title: book.title, // Book title
            borrowedDate: book.borrowed_date ? new Date(book.borrowed_date).toLocaleDateString() : 'N/A', // Format borrowed date
            returnDate: book.return_date ? new Date(book.return_date).toLocaleDateString() : 'N/A', // Format return date
            isReturned: book.is_returned ? 'Yes' : 'No', // Convert boolean to 'Yes' or 'No'
          }));
        } else {
          console.error('Expected an array but got:', books);
        }
      },
      (error) => {
        console.error('Error fetching borrowed books:', error);
      }
    );
  
    // Fetch overdue books (general overdue, with user details)
    this.dashboardService.getOverdueBooks().subscribe(
      (books: any) => {
        console.log('Overdue Books API Response:', books); // Log the response
        if (Array.isArray(books)) {
          this.totalOverdueBooks = books.length;
          this.overdueBooks = books.map((book: any) => ({
            user: `${book.firstName} ${book.lastName}`, // Include user name
            title: book.title,
            borrowedDate: book.borrowed_date ? new Date(book.borrowed_date).toLocaleDateString() : 'N/A',
            overdueSince: book.overdue_since ? new Date(book.overdue_since).toLocaleDateString() : 'N/A',
          }));
        } else {
          console.error('Expected an array but got:', books);
        }
      },
      (error) => {
        console.error('Error fetching overdue books:', error);
      }
    );
  
    // Fetch all attachments
    this.dashboardService.getAllAttachments().subscribe(
      (response: any) => {
        console.log('Attachments API Response:', response); // Log the response
        if (response.attachments && Array.isArray(response.attachments)) {
          this.totalAttachments = response.attachments.length;
        } else if (response.message) {
          console.log(response.message); // Log the message
          this.totalAttachments = 0; // Set attachments count to 0
        } else {
          console.error('Expected an array but got:', response);
        }
  
        // Render charts after all data is fetched
        this.createCharts();
      },
      (error) => {
        console.error('Error fetching attachments:', error);
      }
    );
  }

  createCharts(): void {
    // Books Chart
    const booksChart = new Chart('booksChart', {
      type: 'bar',
      data: {
        labels: ['Total Books', 'Borrowed Books', 'Overdue Books'],
        datasets: [
          {
            label: 'Books',
            data: [this.totalBooks, this.totalBorrowedBooks, this.totalOverdueBooks],
            backgroundColor: ['#007bff', '#28a745', '#dc3545'],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Users Chart
    const usersChart = new Chart('usersChart', {
      type: 'pie',
      data: {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
          {
            label: 'Users',
            data: [this.activeUsers, this.inactiveUsers],
            backgroundColor: ['#28a745', '#dc3545'],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}