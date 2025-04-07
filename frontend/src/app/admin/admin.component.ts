import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  activeTab: string = 'overview';
  isSidebarVisible: boolean = false;
  isDarkMode: boolean = false;
  isProfileDropdownVisible: boolean = false;
  notificationsCount: number = 3;
  isLoading: boolean = false;
  userName: string = 'User'; // Default name

  constructor(private authService: AuthService) {}
  
  ngOnInit() {
    this.userName = this.authService.getUserFullName();
    this.simulateLoading();
  }

  getUserName() {
    const name = this.authService.getUserIdFromToken();
    if (name) {
      this.userName = name;
    }
  }
  onLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response.message); // "Logged out successfully"
        // No need to navigate here; it's already handled in the AuthService
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.hideSidebarOnSmallScreen();
  }

  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  hideSidebarOnSmallScreen() {
    if (window.innerWidth <= 768) {
      this.isSidebarVisible = false;
    }
  }

  hideSidebarOnOutsideClick() {
    if (this.isSidebarVisible && window.innerWidth <= 768) {
      this.isSidebarVisible = false;
    }
  }


  toggleProfileDropdown() {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

 
  // Simulate loading state
  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }




  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isSidebarVisible = false;
    }
  }
}
