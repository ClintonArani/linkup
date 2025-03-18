import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  posts: {
    user: string;
    content: string;
    createdAt: Date;
    image?: string;
    likes: number;
    comments: any[];
    shares: number;
    newComment?: string;
    showCommentSection: boolean;
    showAllComments: boolean;
    userProfileImage: string;

  }[] = [
    {
      user: 'John Doe',
      content: 'Excited for the upcoming university event! 🎉',
      createdAt: new Date(),
      image: 'assets/person1.png',
      likes: 0,
      comments: [],
      shares: 0,
      showCommentSection: false,
      showAllComments: false,
      userProfileImage: 'assets/person1.png'
    },
    {
      user: 'Jane Smith',
      content: 'Does anyone have notes for the last lecture?',
      createdAt: new Date(),
      image: 'assets/person2.png',
      likes: 0,
      comments: [],
      shares: 0,
      showCommentSection: false,
      showAllComments: false,
      userProfileImage: 'assets/person2.png'
    },
    {
      user: 'Michael Brown',
      content: 'Library is packed today! 📚',
      createdAt: new Date(),
      image: 'assets/person3.png',
      likes: 0,
      comments: [],
      shares: 0,
      showCommentSection: false,
      showAllComments: false,
      userProfileImage: 'assets/person3.png'
    }
  ];

  newPost: string = '';
  selectedImage: string | undefined = undefined;

  constructor() {}

  addPost() {
    if (this.newPost.trim()) {
      const newEntry = {
        user: 'Clinton Omari',
        content: this.newPost,
        createdAt: new Date(),
        image: this.selectedImage,
        likes: 0,
        comments: [],
        shares: 0,
        showCommentSection: false,
        showAllComments: false,
        userProfileImage: 'assets/clinton.jpg'
      };

      this.posts.unshift(newEntry);
      this.newPost = '';
      this.selectedImage = undefined;
    }
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  likePost(post: any) {
    post.likes++;
  }

  toggleCommentSection(post: any) {
    post.showCommentSection = !post.showCommentSection;
  }

  addComment(post: any) {
    if (post.newComment && post.newComment.trim()) {
      const newComment = {
        user: 'Anonymous',
        text: post.newComment,
        likes: 0,
        replies: [],
        showReplyForm: false
      };
      post.comments.push(newComment);
      post.newComment = '';
    }
  }

  likeComment(post: any, comment: any) {
    comment.likes++;
  }

  replyToComment(post: any, comment: any) {
    comment.showReplyForm = !comment.showReplyForm;
  }

  addReply(post: any, comment: any) {
    if (comment.newReply && comment.newReply.trim()) {
      const newReply = {
        user: 'Anonymous',
        text: comment.newReply
      };
      comment.replies.push(newReply);
      comment.newReply = '';
      comment.showReplyForm = false;
    }
  }

  toggleAllComments(post: any) {
    post.showAllComments = !post.showAllComments;
  }

  shareOnPlatform(post: any, platform: string) {
    post.shares++;
    alert(`Post shared to ${platform}!`); // Placeholder action
  }
}
