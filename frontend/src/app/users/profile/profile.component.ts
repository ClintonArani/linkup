import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profile?: string;
  profession?: string;
  bio?: string;
  university?: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading = true;
  error: string | null = null;
  editMode = false;
  editedUser: Partial<UserProfile> = {};


  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // private getCompleteImageUrl(path: string | undefined): string {
  //   if (!path) return 'assets/default-profile.png';
  //   if (path.startsWith('http')) return path;
  //   // Handle both paths with and without leading slash
  //   return `${'http://localhost:9000'}${path.startsWith('/') ? path : '/' + path}`;
  // }

  loadUserProfile(): void {
    this.isLoading = true;
    this.error = null;
    
    const basicInfo = this.profileService.getBasicUserInfo();
    
    this.profileService.getProfileDetails().subscribe({
      next: (profileDetails) => {
        this.user = {
          ...basicInfo,
          profile: this.getCompleteImageUrl(profileDetails.profileImage), // Add this line
          profession: profileDetails.profession || '',
          bio: profileDetails.bio || '',
          university: profileDetails.university || '',
          id: basicInfo.id,
          phoneNumber: basicInfo.phoneNumber,
          createdAt: basicInfo.createdAt,
          updatedAt: basicInfo.updatedAt,
          role: basicInfo.role
        };
        this.editedUser = { ...this.user };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Profile error:', err);
        this.error = 'Failed to load profile details. Using basic information.';
        this.user = {
          ...basicInfo,
          profile: 'assets/default-profile.png',
          profession: '',
          bio: '',
          university: '',
          id: basicInfo.id,
          phoneNumber: basicInfo.phoneNumber,
          createdAt: basicInfo.createdAt,
          updatedAt: basicInfo.updatedAt,
          role: basicInfo.role
        };
        this.editedUser = { ...this.user };
        this.isLoading = false;
      }
    });
  }

  private getCompleteImageUrl(path: string | undefined | null): string {
    if (!path) return 'assets/default-profile.png';
    if (path.startsWith('http')) return path;
    // Ensure the base URL doesn't have a trailing slash
    const baseUrl = 'http://localhost:9000'.replace(/\/$/, '');
    // Ensure the path doesn't have a leading slash (we'll add it)
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/${cleanPath}`;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-profile.png';
    imgElement.onerror = null;
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.editedUser = { ...this.user };
    }
  }

  saveProfile(): void {
    if (!this.user) return;

    this.isLoading = true;
    this.profileService.updateProfileDetails({
      profession: this.editedUser.profession,
      bio: this.editedUser.bio,
      university: this.editedUser.university
    }).subscribe({
      next: () => {
        this.loadUserProfile();
        this.editMode = false;
      },
      error: (err) => {
        this.error = 'Failed to update profile. Please try again.';
        this.isLoading = false;
        console.error('Profile update error:', err);
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.profileService.uploadProfileImage(file).subscribe({
        next: (response) => {
          if (this.user) {
            this.user.profile = this.getCompleteImageUrl(response.imageUrl);
            this.editedUser.profile = this.user.profile;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to upload image. Please try again.';
          this.isLoading = false;
          console.error('Image upload error:', err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}