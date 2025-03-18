import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { UsersComponent } from './users/users.component';
import { HomeComponent } from './users/home/home.component';
import { MessagesComponent } from './users/messages/messages.component';
import { ForumComponent } from './users/forums/forums.component';
import { AttachmentsComponent } from './users/attachments/attachments.component';
import { ProfileComponent } from './users/profile/profile.component';
import { NotificationsComponent } from './users/notifications/notifications.component';
import { ResourcesComponent } from './users/resources/resources.component';
import { ConnectionsComponent } from './users/connections/connections.component';
import { ChatbotComponent } from './users/chatbot/chatbot.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { AttachmentComponent } from './admin/attachment/attachment.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { MynetworkComponent } from './users/mynetwork/mynetwork.component';
import { AuthGuard } from './auth.guard'; // Import the AuthGuard
import { BookComponent } from './admin/book/book.component';

export const routes: Routes = [
    { path: 'login', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
    
    {
      path: 'user',
      component: UsersComponent,
      canActivate: [AuthGuard],  // Main guard
      canActivateChild: [AuthGuard], // Protect child routes
      children: [
        { path: '', redirectTo: 'home', pathMatch: 'full' }, 
        { path: 'home', component: HomeComponent },
        { path: 'messages', component: MessagesComponent },
        { path: 'forum', component: ForumComponent },
        { path: 'attachment', component: AttachmentsComponent },
        { path: 'connections', component: ConnectionsComponent },
        { path: 'chatbot', component: ChatbotComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'notifications', component: NotificationsComponent },
        { path: 'resources', component: ResourcesComponent },
        { path: 'mynetwork', component: MynetworkComponent }
      ]
    },
  

    // Protected routes for admin users
    { 
        path: 'admin', 
        component: AdminComponent,
        canActivate: [AuthGuard], // Apply AuthGuard to the parent route
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirects /admin to /admin/dashboard
            { path: 'dashboard', component: DashboardComponent },
            { path: 'users', component: ManageUsersComponent },
            { path: 'internships', component: AttachmentComponent },
            { path: 'reports', component: ReportsComponent },
            { path: 'books', component: BookComponent}
        ]
    },
    { path: '**', redirectTo: '/login' } , 
];