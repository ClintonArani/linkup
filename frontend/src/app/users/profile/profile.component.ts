import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user = {
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    bio: 'Software Engineer at Rosa Corps',
    professionalism: 'Full Stack Developer',
    role: 'Senior Engineer',
    age: 28,
    university: 'Chuka University',
    profilePicture: 'assets/default-profile.jpg'
  };

  forums = ['Angular Developers', 'Tech Innovators', 'Full Stack Devs'];
  connections = 120;
  appliedInternships = [
    { title: 'Software Engineer Intern', company: 'Google' },
    { title: 'Backend Developer', company: 'Amazon' }
  ];

  openUpdateProfileModal() {
    const modal = document.getElementById('updateProfileModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeUpdateProfileModal() {
    const modal = document.getElementById('updateProfileModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  updateProfile() {
    alert('Profile updated successfully! ✅');
    this.closeUpdateProfileModal();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePicture = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}