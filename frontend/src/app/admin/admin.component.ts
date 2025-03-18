import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  activeTab: string = 'overview';
  isSidebarVisible: boolean = false;
  isDarkMode: boolean = false;
  isProfileDropdownVisible: boolean = false;
  notificationsCount: number = 3;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

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

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

  showNotifications() {
    alert(`You have ${this.notificationsCount} new notifications.`);
  }

  // Simulate loading state
  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  // Simulate real-time notifications
  simulateRealTimeNotifications() {
    setInterval(() => {
      this.notificationsCount = Math.floor(Math.random() * 10);
    }, 5000);
  }

  ngOnInit() {
    this.simulateLoading();
    this.simulateRealTimeNotifications();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isSidebarVisible = false;
    }
  }
}
