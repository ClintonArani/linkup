// post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:9000/posts';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getUserId(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id; // Make sure this matches your token structure
    }
    return '';
  }

  // post.service.ts
  createPost(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, formData, {
      headers: this.getHeaders()
    });
  }

  getAllPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }

  getPostById(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}`, {
      headers: this.getHeaders()
    });
  }

  updatePost(postId: string, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${postId}`, {
      user_id: this.getUserId(),
      content: content
    }, {
      headers: this.getHeaders()
    });
  }

  updatePostWithImage(postId: string, content: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('user_id', this.getUserId());
    formData.append('content', content);
    formData.append('image', image);

    return this.http.post(`${this.apiUrl}/${postId}/upload-image`, formData, {
      headers: this.getHeaders()
    });
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, {
      headers: this.getHeaders(),
      body: {
        user_id: this.getUserId()
      }
    });
  }
  // post.service.ts
likePost(postId: string): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    return throwError(() => new Error('No token found'));
  }

  const decoded: any = jwtDecode(token);
  const userId = decoded.id; // Make sure this matches your token structure

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const body = {
    user_id: userId // This is what your backend expects in the body
  };

  console.log('Sending like request to:', `${this.apiUrl}/${postId}/like`);
  console.log('Request body:', body);

  return this.http.post(`${this.apiUrl}/${postId}/like`, body, { headers }).pipe(
    tap(response => console.log('Like successful:', response)),
    catchError(error => {
      console.error('Like error:', error);
      return throwError(() => error);
    })
  );
}
  
  unlikePost(postId: string): Observable<any> {
    const headers = this.getHeaders();
    const options = {
      headers,
      body: { user_id: this.getUserId() }
    };
    
    console.log('Unlike request:', { postId, options }); // Debug log
    
    return this.http.delete(`${this.apiUrl}/${postId}/like`, options).pipe(
      tap(response => console.log('Unlike response:', response)),
      catchError(error => {
        console.error('Unlike error:', error);
        return throwError(error);
      })
    );
  }
  
  addComment(postId: string, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${postId}/comments`, {
      user_id: this.getUserId(), // This will use the correct 'id' from token
      content: content
    }, {
      headers: this.getHeaders()
    });
  }

  updateComment(commentId: string, content: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/comments/${commentId}`, {
      user_id: this.getUserId(),
      content: content
    }, {
      headers: this.getHeaders()
    });
  }

  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, {
      headers: this.getHeaders(),
      body: {
        user_id: this.getUserId()
      }
    });
  }

  getPostComments(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${postId}/comments`, {
      headers: this.getHeaders()
    });
  }
}