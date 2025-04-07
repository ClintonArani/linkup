import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map, of } from 'rxjs';

interface ProfileDetails {
  profileImage?: string;
  bio?: string;
  profession?: string;
  university?: string;
}

interface TokenPayload {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:9000/users';
  private tokenData: TokenPayload;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    this.tokenData = jwtDecode<TokenPayload>(token);
  }

  getBasicUserInfo(): TokenPayload {
    return this.tokenData;
  }

  getUserId(): string {
    return this.tokenData.id;
  }

  uploadProfileImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);
    return this.http.post<{ imageUrl: string }>(
      `${this.apiUrl}/${this.getUserId()}/upload-profile`, 
      formData
    );
  }

  updateProfileDetails(profileData: ProfileDetails): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${this.getUserId()}/profile`, 
      profileData
    );
  }

  getProfileDetails(): Observable<ProfileDetails> {
    return this.http.get<{ profile: ProfileDetails }>(
      `${this.apiUrl}/${this.getUserId()}/profile`
    ).pipe(
      map(response => response.profile),
      catchError(error => {
        console.error('Error fetching profile details:', error);
        return of({});
      })
    );
  }
}