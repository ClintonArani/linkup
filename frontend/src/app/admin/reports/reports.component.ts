import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportsService } from '../../services/reports.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.reportsService.getAllUsers().subscribe(
      data => {
        if (data && Array.isArray(data)) {
          const transformedData = data.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
          }));
          this.reports.push({ title: 'All Users Report', data: transformedData });
        } else {
          console.error('Invalid data format for All Users Report:', data);
        }
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );

    this.reportsService.getBorrowedResources().subscribe(
      data => {
        if (data && Array.isArray(data)) {
          const transformedData = data.map(item => ({
            title: item.title,
            borrower: item.borrowerName || 'Unknown', // Fallback for missing borrower name
            borrowedDate: item.borrowedDate ? new Date(item.borrowedDate).toLocaleDateString() : 'N/A', // Handle invalid dates
            returnDate: item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'N/A' // Handle invalid dates
          }));
          this.reports.push({ title: 'Borrowed Resources Report', data: transformedData });
        } else {
          console.error('Invalid data format for Borrowed Resources Report:', data);
        }
      },
      error => {
        console.error('Error fetching borrowed resources:', error);
      }
    );
  }

  generatePdf(report: any): void {
    if (!report.data || !Array.isArray(report.data) || report.data.length === 0) {
      console.error('No data available for the report:', report.title);
      alert('No data available for this report.');
      return;
    }

    const doc = new jsPDF();
    const logo = new Image();
    logo.src = 'assets/logo.png';

    doc.addImage(logo, 'PNG', 10, 10, 50, 20);
    doc.setFontSize(18);
    doc.text(report.title, 70, 20);
    doc.setFontSize(12);
    doc.text(`Generated by: Clinton`, 70, 30);

    const columns = Object.keys(report.data[0]);
    const rows = report.data.map((item: any) => Object.values(item));

    autoTable(doc, {
      startY: 40,
      head: [columns],
      body: rows
    });

    doc.save(`${report.title}.pdf`);
  }
}