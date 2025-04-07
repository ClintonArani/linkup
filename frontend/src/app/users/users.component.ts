import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  activeTab: string = 'home';
  isSidebarVisible: boolean = false;
  isDarkMode: boolean = false;
  isProfileDropdownVisible: boolean = false;
  notificationsCount: number = 3;
  isLoading: boolean = false;
  userName: string = 'User'; // Default name
  firstName!: string;
  profileImage!: string

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.userName = this.authService.getUserFullName();
    this.firstName = this.authService.getUserFirstName();
    this.simulateLoading();
    this.simulateRealTimeNotifications();
    this.fetchUserProfile();

  }

  getUserName() {
    const name = this.authService.getUserIdFromToken();
    if (name) {
      this.userName = name;
    }
  }

  fetchUserProfile() {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (response) => {
          if (response.user?.profile) {
            // Construct the full image URL
            this.profileImage = this.getFullImageUrl(response.user.profile);
            console.log('Trying to load image from:', this.profileImage);
          }
          if (response.user?.firstName) {
            this.firstName = response.user.firstName;
          }
        },
        error: (err) => {
          console.error('Failed to fetch user profile:', err);
          this.useFallbackImage();
        }
      });
    }
  }

  getFullImageUrl(relativePath: string): string {
    // Remove leading slash if present
    const cleanPath = relativePath.startsWith('/') 
      ? relativePath.substring(1) 
      : relativePath;
    
    // Return full URL (add cache buster to prevent caching issues)
    return `http://localhost:9000/${cleanPath}?t=${new Date().getTime()}`;
  }

 

  handleImageError(event: Event) {
    this.useFallbackImage();
    console.error('Error loading profile image');
  }
  
  verifyImageLoad(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
  }
  
  useFallbackImage() {
    this.profileImage = 'assets/image1.png';
    console.warn('Using fallback profile image');
  }
  
  onLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response.message);
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

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  simulateRealTimeNotifications() {
    setInterval(() => {
      this.notificationsCount = Math.floor(Math.random() * 10);
    }, 5000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isSidebarVisible = false;
    }
  }
}
