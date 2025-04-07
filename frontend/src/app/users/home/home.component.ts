// home.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ChatbotsystemComponent } from "../../components/chatbotsystem/chatbotsystem.component";
import { PostService } from '../../services/post.service';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatbotsystemComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {
  showChat = false;
  posts: any[] = [];
  newPost: string = '';
  selectedImage: File | null = null;
  currentUser: any = {};
  likedPosts: Set<string> = new Set(); // Track liked posts
  private apiBaseUrl = 'http://localhost:9000';
assets: any;
default: any;
profile: any;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
    this.getCurrentUser();
  }

  private getFullImagePath(path: string): string {
    if (!path) return 'assets/default-profile.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:9000/${path.replace(/^\/+/, '')}`;
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      this.currentUser = {
        id: decoded.id, // Changed from decoded.user_id to decoded.id
        name: `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim() || 'Anonymous',
        profileImage: this.getFullImagePath(decoded.user_profile)
      };
    }
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (response) => {
        this.posts = response.map((post: any) => ({
          ...post,
          showCommentSection: false,
          showAllComments: false,
          newComment: '',
          comments: post.comments || [],
          userProfileImage: this.getFullImagePath(post.user_profile|| 'assets/default-profile.png') ,
          user: {
            name: `${post.firstName || ''} ${post.lastName || ''}`.trim() || 'Anonymous',
            profileImage: this.getFullImagePath(post.user_profile)
          },
          image: post.image_url ? this.getFullImagePath(post.image_url) : null,
          isLiked: post.is_liked || false, // Use backend's is_liked flag
          likes: post.likes_count || 0,    // Use backend's likes_count
          shares: post.shares || 0
        }));
      },
      error: (err) => {
        console.error('Error loading posts:', err);
      }
    });
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  onChatClosed() {
    this.showChat = false;
  }

  async addPost() {
    if (!this.newPost.trim() && !this.selectedImage) {
      alert('Please enter text or select an image');
      return;
    }
  
    try {
      const formData = new FormData();
      
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        formData.append('user_id', decoded.id); // Use 'id' from the token
      } else {
        throw new Error('No token found');
      }
      
      formData.append('content', this.newPost);
      
      if (this.selectedImage) {
        formData.append('image', this.selectedImage, this.selectedImage.name);
      }
  
      const result = await this.postService.createPost(formData).toPromise();
      console.log('Post created successfully:', result);
  
      this.loadPosts();
      this.resetPostForm();
    } catch (error) {
      this.handlePostError(error);
    }
  }

  private resetPostForm() {
    this.newPost = '';
    this.selectedImage = null;
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  private handlePostError(error: unknown) {
    console.error('Full error:', error);
    
    if (error instanceof HttpErrorResponse) {
      console.error('Error details:', {
        status: error.status,
        message: error.message,
        error: error.error
      });
      
      if (error.status === 400) {
        alert(`Validation error: ${error.error?.message || 'Invalid data'}`);
      } else if (error.status === 401) {
        alert('Please login again');
      } else {
        alert(`Server error: ${error.statusText}`);
      }
    } else {
      alert('Unknown error occurred. Check console for details');
    }
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    this.selectedImage = fileInput?.files?.[0] || null;
  }

  likePost(post: any) {
    if (!post?.id) {
      console.error('Post ID is missing');
      return;
    }

    if (!this.currentUser?.id) {
      console.error('User not authenticated');
      return;
    }

    console.log(`Toggling like for post ${post.id}, current state: ${post.isLiked}`);

    const request$ = post.isLiked 
      ? this.postService.unlikePost(post.id)
      : this.postService.likePost(post.id);

    request$.subscribe({
      next: () => {
        // Optimistically update the UI
        post.isLiked = !post.isLiked;
        post.likes = post.isLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
        console.log(`Like toggled successfully. New state: ${post.isLiked}`);
      },
      error: (err) => {
        console.error('Error toggling like:', err);
      }
    });
  }

  toggleCommentSection(post: any) {
    post.showCommentSection = !post.showCommentSection;
    if (post.showCommentSection && !post.commentsLoaded) {
      this.postService.getPostComments(post.id).subscribe({
        next: (comments) => {
          post.comments = comments.map((comment: any) => ({
            ...comment,
            user: {
              name: `${comment.firstName} ${comment.lastName || ''}`.trim(),
              profileImage: this.getFullImagePath(comment.user_profile)
            },
            likes: comment.likes || 0,
            replies: [],
            showReplyForm: false
          }));
          post.commentsLoaded = true;
        },
        error: (err) => {
          console.error('Error loading comments:', err);
        }
      });
    }
  }

  addComment(post: any) {
    if (post.newComment && post.newComment.trim()) {
      this.postService.addComment(post.id, post.newComment).subscribe({
        next: (newComment: any) => {
          post.newComment = '';
          this.loadPosts();
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        }
      });
    }
  }

  likeComment(post: any, comment: any) {
    comment.likes = (comment.likes || 0) + 1;
  }

  replyToComment(post: any, comment: any) {
    comment.showReplyForm = !comment.showReplyForm;
  }

  addReply(post: any, comment: any) {
    if (comment.newReply && comment.newReply.trim()) {
      comment.replies.push({
        user: {
          name: this.currentUser.name,
          profileImage: this.currentUser.profileImage || 'assets/default-profile.png'
        },
        content: comment.newReply
      });
      comment.newReply = '';
      comment.showReplyForm = false;
    }
  }

  toggleAllComments(post: any) {
    post.showAllComments = !post.showAllComments;
  }

  shareOnPlatform(post: any, platform: string) {
    post.shares = (post.shares || 0) + 1;
    alert(`Post shared to ${platform}!`);
  }
}
